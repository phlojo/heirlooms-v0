import { openai } from "@ai-sdk/openai"
import { OpenAI } from "openai"

/**
 * OpenAI client instance for direct API calls
 * Throws an error if OPENAI_API_KEY is not configured
 */
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Please add it to your environment variables. " +
        "You can get an API key from https://platform.openai.com/api-keys",
    )
  }

  return new OpenAI({ apiKey })
}

/**
 * Export openai from @ai-sdk/openai for use with Vercel AI SDK
 */
export { openai }

/**
 * Get the AI model to use for general text generation
 * @returns Model identifier (default: gpt-4o-mini)
 */
export function getTextModel(): string {
  return process.env.AI_MODEL_TEXT || "gpt-4o-mini"
}

/**
 * Get the AI model to use for vision/image analysis
 * @returns Model identifier (default: gpt-4o)
 */
export function getVisionModel(): string {
  return process.env.AI_MODEL_VISION || "gpt-4o"
}

/**
 * Get the AI model to use for summarization tasks
 * @returns Model identifier (default: gpt-4o-mini)
 */
export function getSummaryModel(): string {
  return process.env.AI_MODEL_SUMMARY || "gpt-4o-mini"
}

/**
 * Get the Whisper model to use for audio transcription
 * @returns Model identifier (default: whisper-1)
 */
export function getTranscribeModel(): string {
  return process.env.AI_TRANSCRIBE_MODEL || "whisper-1"
}
