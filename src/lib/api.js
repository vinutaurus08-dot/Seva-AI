import { answerAssistantQuestion, answerSchemeQuestion } from './recommend.js'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function callMlApi(payload) {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(`API returned ${response.status}`)
    const data = await response.json()
    return data.answer
  } catch (error) {
    console.warn('SevaAI backend unreachable, using local fallback:', error)
    return null
  }
}

// Streaming call: returns a promise that resolves when stream ends.
// onChunk(text) will be called for each chunk received.
export async function callMlApiStream(payload, onChunk) {
  try {
    const res = await fetch(`${API_URL}/predict/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`API returned ${res.status}`)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let done = false
    while (!done) {
      const { value, done: d } = await reader.read()
      done = d
      if (value) {
        const chunk = decoder.decode(value)
        // SSE-style chunks: look for lines starting with 'data: '
        chunk.split(/\n\n/).forEach((frame) => {
          const m = frame.match(/^data:\s?(.*)$/m)
          if (m && m[1]) onChunk(m[1])
        })
      }
    }
    return true
  } catch (error) {
    console.warn('SevaAI backend unreachable (stream), using local fallback:', error)
    return false
  }
}

export async function getSchemeAnswer(scheme, question) {
  const aiAnswer = await callMlApi({
    query: question,
    scheme_id: scheme?.id,
    mode: 'scheme',
  })
  if (aiAnswer) return aiAnswer
  return answerSchemeQuestion(scheme, question)
}

export async function getAssistantAnswer(question) {
  const aiAnswer = await callMlApi({
    query: question,
    mode: 'assistant',
  })
  if (aiAnswer) return aiAnswer
  return answerAssistantQuestion(question)
}

export async function getSchemeAnswerStream(scheme, question, onChunk) {
  const ok = await callMlApiStream(
    { query: question, scheme_id: scheme?.id, mode: 'scheme' },
    onChunk
  )
  if (!ok) {
    // fallback to local answer in a single chunk
    onChunk(answerSchemeQuestion(scheme, question))
  }
}
