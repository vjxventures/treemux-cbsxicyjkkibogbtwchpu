import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { code, language } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    system: `You are a code analysis expert. Analyze the provided code and generate a detailed flowchart representation in JSON format.

Your response must be VALID JSON with this exact structure:
{
  "nodes": [
    {"id": "1", "type": "start", "label": "Start", "description": "Entry point"},
    {"id": "2", "type": "process", "label": "Process name", "description": "What happens here", "code": "relevant code snippet"}
  ],
  "edges": [
    {"source": "1", "target": "2", "label": "condition or flow"}
  ],
  "complexity": {"cyclomatic": 5, "cognitive": 8},
  "summary": "Brief explanation of what the code does"
}

Node types: start, end, process, decision, loop, function, error
Focus on control flow, important operations, and decision points.
Keep descriptions concise and actionable.`,
    prompt: `Analyze this ${language} code and generate a flowchart JSON:\n\n${code}`,
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}
