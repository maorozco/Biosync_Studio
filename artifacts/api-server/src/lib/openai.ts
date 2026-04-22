// Thin OpenAI client that supports both Azure OpenAI Service and OpenAI direct.
// Returns null in mock mode so callers can short-circuit cleanly.
//
// Env var contract:
//   - OPENAI_API_KEY                     → use OpenAI direct
//   - AZURE_OPENAI_API_KEY + AZURE_OPENAI_ENDPOINT → use Azure OpenAI
//   - neither set                         → mock mode (null)
//
// Models used:
//   - chat completion: OPENAI_CHAT_MODEL      (default "gpt-4o-mini")
//   - embeddings:      OPENAI_EMBED_MODEL     (default "text-embedding-3-small")
//
// Azure deployment name can differ from model name; we read
// AZURE_OPENAI_CHAT_DEPLOYMENT + AZURE_OPENAI_EMBED_DEPLOYMENT if set.

import OpenAI, { AzureOpenAI } from "openai";

export const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini";
export const EMBED_MODEL =
  process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small";

export const AZURE_CHAT_DEPLOYMENT =
  process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ?? CHAT_MODEL;
export const AZURE_EMBED_DEPLOYMENT =
  process.env.AZURE_OPENAI_EMBED_DEPLOYMENT ?? EMBED_MODEL;

let _client: OpenAI | AzureOpenAI | null | undefined;

export function getOpenAIClient(): OpenAI | AzureOpenAI | null {
  if (_client !== undefined) return _client;

  const azureKey = process.env.AZURE_OPENAI_API_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (azureKey && azureEndpoint) {
    _client = new AzureOpenAI({
      apiKey: azureKey,
      endpoint: azureEndpoint,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-10-21",
    });
    return _client;
  }
  if (openaiKey) {
    _client = new OpenAI({ apiKey: openaiKey });
    return _client;
  }
  _client = null;
  return _client;
}

export function isLlmConfigured(): boolean {
  return getOpenAIClient() !== null;
}

export function getChatModelId(): string {
  const azureKey = process.env.AZURE_OPENAI_API_KEY;
  return azureKey ? AZURE_CHAT_DEPLOYMENT : CHAT_MODEL;
}

export function getEmbedModelId(): string {
  const azureKey = process.env.AZURE_OPENAI_API_KEY;
  return azureKey ? AZURE_EMBED_DEPLOYMENT : EMBED_MODEL;
}
