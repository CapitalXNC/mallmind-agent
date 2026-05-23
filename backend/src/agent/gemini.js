import { GoogleGenAI } from '@google/genai';
import { toolDefinitions } from '../tools/index.js';
import { runTool } from './toolRunner.js';
import { logAgentAction } from '../tools/index.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../../.env') });

const ai = new GoogleGenAI({
  vertexai: true,
  project: 'mallmind-agent',
  location: 'us-central1'
});

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
- Learn from historical incidents

When responding:
1. ALWAYS check weather context first when assessing any crowd or traffic situation
2. Query actual data before making recommendations
3. Log incidents when you detect real problems
4. Trigger campaigns when action is needed
5. Be concise but thorough in your reasoning
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        tools
      }
    });

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

    const toolResults = [];
    for (const part of functionCalls) {
      const { name, args } = part.functionCall;
      toolsUsed.push(name);
      const result = await runTool(name, args);
      toolResults.push({
        functionResponse: {
          name,
          response: result
        }
      });
    }

    contents.push({ role: 'user', parts: toolResults });
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