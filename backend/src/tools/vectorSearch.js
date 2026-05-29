import { connectDB } from '../db/connection.js';
import { ai, embeddingModel } from '../lib/genai.js';

export async function generateEmbedding(text) {
  try {
    const response = await ai.models.embedContent({
      model: embeddingModel,
      contents: text
    });
    return response.embeddings[0].values;
  } catch (err) {
    console.error('Embedding error:', err.message);
    return null;
  }
}

export async function embedIncident(incidentId) {
  const db = await connectDB();
  const incident = await db.collection('incidents').findOne({ incidentId });
  if (!incident) return null;

  const text = `${incident.type} ${incident.title} ${incident.description} zone: ${incident.zoneName} severity: ${incident.severity}`;
  const embedding = await generateEmbedding(text);
  if (!embedding) return null;

  await db.collection('incidents').updateOne(
    { incidentId },
    { $set: { embedding } }
  );

  return embedding;
}

function normalizeSimilarityArgs(args) {
  if (typeof args === 'string') {
    return { query: args, limit: 3 };
  }

  if (!args || typeof args !== 'object') {
    return { query: '', limit: 3 };
  }

  return {
    query: typeof args.query === 'string' ? args.query : '',
    limit: typeof args.limit === 'number' ? args.limit : 3
  };
}

export async function findSimilarIncidents(args) {
  const { query, limit } = normalizeSimilarityArgs(args);
  const db = await connectDB();

  const queryEmbedding = await generateEmbedding(query);
  if (!queryEmbedding) {
    return db.collection('incidents')
      .find({ status: 'resolved' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  try {
    const results = await db.collection('incidents').aggregate([
      {
        $vectorSearch: {
          index: 'incident_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit
        }
      },
      {
        $project: {
          incidentId: 1,
          type: 1,
          title: 1,
          description: 1,
          severity: 1,
          status: 1,
          zoneName: 1,
          createdAt: 1,
          agentActions: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ]).toArray();

    return results;
  } catch (err) {
    console.log('Vector search fallback (index not ready):', err.message);
    return db.collection('incidents')
      .find({ status: 'resolved' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }
}
