import { toolDefinitions } from '../tools/index.js';
import { runTool } from './toolRunner.js';
import { logAgentAction } from '../tools/index.js';
import { ai, agentModel, formatGenAIError } from '../lib/genai.js';

const tools = [{
  functionDeclarations: toolDefinitions.map(t => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters
  }))
}];

const systemInstruction = `You are MallMind, an AI operations agent for a large shopping mall.
You have access to real-time data and can take actions to manage the mall.

Your responsibilities:
- Monitor foot traffic and detect crowd surges
- Alert relevant tenants when issues affect them
- Trigger marketing campaigns to redirect traffic or boost revenue
- Log all incidents with proper severity levels
- Check weather to predict traffic patterns
- Use vector search to find similar past incidents and learn from them

When responding:
1. ALWAYS check weather context first when assessing any crowd or traffic situation
2. Use find_similar_incidents BEFORE logging a new incident to learn from history
3. Query actual data before making recommendations
4. Log incidents when you detect real problems
5. Trigger campaigns when action is needed
6. Always tell the operator what actions you took and what was written to the database

You are managing Westfield Grand Mall in Dallas, TX.`;

export async function runAgentQuery(userMessage, sessionId) {
  const contents = [{ role: 'user', parts: [{ text: userMessage }] }];
  const toolsUsed = [];
  let finalResponse = '';

  console.log(`\nAgent session ${sessionId}: "${userMessage}"`);

  let iterations = 0;
  const maxIterations = 10;

  while (iterations < maxIterations) {
    iterations++;

    let response;
    try {
      response = await ai.models.generateContent({
        model: agentModel,
        contents,
        config: {
          systemInstruction,
          tools
        }
      });
    } catch (err) {
      throw formatGenAIError(err);
    }

    const candidate = response.candidates[0];
    const parts = candidate.content.parts;

    contents.push({ role: 'model', parts });

    const functionCalls = parts.filter(p => p.functionCall);
    const textParts = parts.filter(p => p.text);

    if (textParts.length > 0) {
      finalResponse = textParts.map(p => p.text).join('');
    }

    if (functionCalls.length === 0) {
      break;
    }

    const functionResponseParts = [];

for (const part of functionCalls) {
  const { name, args } = part.functionCall;
  toolsUsed.push(name);
  const result = await runTool(name, args);

  functionResponseParts.push({
    functionResponse: {
      name,
      response: { output: JSON.stringify(result) }
    }
  });
}

contents.push({
  role: 'user',
  parts: functionResponseParts
});

}

  await logAgentAction({
    sessionId,
    actionType: 'query',
    input: userMessage,
    output: finalResponse,
    toolsUsed
  });

  return {
    response: finalResponse,
    toolsUsed,
    sessionId
  };
}
