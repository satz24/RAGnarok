/** Gemini API key — set via VITE_GEMINI_API_KEY in .env.local only */
export function getApiKey(): string | null {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  return key?.trim() || null
}

export function hasApiKey(): boolean {
  return Boolean(getApiKey())
}
