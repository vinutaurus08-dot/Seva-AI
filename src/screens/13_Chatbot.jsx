import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble.jsx'
import { getSchemeById } from '../data/schemes.js'
import { getSchemeAnswer } from '../lib/api.js'
import { answerSchemeQuestion, findSchemeByQuery, SCHEME_SUGGESTIONS } from '../lib/recommend.js'

export default function Chatbot() {
  const { id } = useParams()
  const navigate = useNavigate()
  const scheme = id ? getSchemeById(id) : null

  const [messages, setMessages] = useState(() => [
    {
      from: 'bot',
      text: scheme
        ? `Hi! I'm the SevaAI scheme assistant. Ask me anything about "${scheme.name}" — documents, eligibility, how to apply, last date or the official website.`
        : 'Hi! You can still ask me about a scheme by name, for example "What documents are required for SSP?" or "Am I eligible for PM Kisan?"',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // persist per-scheme chat history
  useEffect(() => {
    const key = `chat_messages_${scheme?.id ?? 'global'}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        setMessages(JSON.parse(stored))
      } catch {}
    }
  }, [scheme?.id])

  useEffect(() => {
    const key = `chat_messages_${scheme?.id ?? 'global'}`
    localStorage.setItem(key, JSON.stringify(messages))
  }, [messages, scheme?.id])

  const send = async (text) => {
    const q = (text ?? input).trim()
    if (!q) return
    setMessages((m) => [...m, { from: 'user', text: q }])
    setInput('')

    const targetScheme = scheme || findSchemeByQuery(q)
    const reply = targetScheme ? answerSchemeQuestion(targetScheme, q) : await getSchemeAnswer(null, q)
    setIsTyping(true)
    setMessages((m) => [...m, { from: 'bot', text: '' }])

    const chunks = reply.split(/\n\n|\n/).filter(Boolean)
    let accumulated = ''
    for (const chunk of chunks) {
      accumulated = accumulated ? `${accumulated}\n${chunk}` : chunk
      setMessages((m) => {
        const copy = [...m]
        const idx = copy.map((x) => x.from).lastIndexOf('bot')
        if (idx >= 0) copy[idx] = { from: 'bot', text: accumulated }
        return copy
      })
      await new Promise((resolve) => setTimeout(resolve, 150))
    }

    setIsTyping(false)
  }

  return (
    <div className="screen chat-screen">
      <header className="sub-header purple">
        <button className="back-btn light" onClick={() => navigate(-1)}>←</button>
        <div>
          <h2>SevaAI Chatbot</h2>
          <p className="chat-sub">{scheme ? scheme.name : 'Ask me about any scheme'}</p>
        </div>
      </header>

      <div className="chat-body">
        {messages.map((m, i) => (
          <ChatBubble key={i} from={m.from} text={m.text} />
        ))}
        {isTyping && (
          <div className="chat-row bot">
            <div className="chat-avatar">🤖</div>
            <div className="chat-bubble bot">Typing…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="suggestions">
        {(scheme ? SCHEME_SUGGESTIONS : ['What documents are required for SSP?', 'Am I eligible for PM Kisan?', 'How do I apply for Post Matric Scholarship?']).map((s) => (
          <button key={s} className="suggestion-chip" onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      <div className="chat-input-bar">
        <input
          className="chat-input"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className="send-btn" onClick={() => send()}>➤</button>
      </div>
    </div>
  )
}
