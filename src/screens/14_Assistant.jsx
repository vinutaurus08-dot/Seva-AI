import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav.jsx'
import ChatBubble from '../components/ChatBubble.jsx'
import { getAssistantAnswer } from '../lib/api.js'
import { ASSISTANT_SUGGESTIONS } from '../data/assistantFaqs.js'

export default function Assistant() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! I am your SevaAI Assistant 🤖. I can help you use the app — creating your profile, how recommendations work, applying for schemes, uploading documents and more. How can I help?',
    },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const q = (text ?? input).trim()
    if (!q) return
    setMessages((m) => [...m, { from: 'user', text: q }])
    setInput('')
    const reply = await getAssistantAnswer(q)
    setMessages((m) => [...m, { from: 'bot', text: reply }])
  }

  return (
    <div className="screen chat-screen has-nav">
      <header className="sub-header purple">
        <button className="back-btn light" onClick={() => navigate('/dashboard')}>←</button>
        <div>
          <h2>AI Assistant</h2>
          <p className="chat-sub">How can I help you with SevaAI?</p>
        </div>
      </header>

      <div className="chat-body">
        {messages.map((m, i) => (
          <ChatBubble key={i} from={m.from} text={m.text} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="suggestions">
        {ASSISTANT_SUGGESTIONS.map((s) => (
          <button key={s} className="suggestion-chip" onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      <div className="chat-input-bar with-nav">
        <input
          className="chat-input"
          placeholder="Ask me anything about SevaAI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className="send-btn" onClick={() => send()}>➤</button>
      </div>

      <BottomNav />
    </div>
  )
}
