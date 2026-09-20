// A single chat message bubble. `from` is 'bot' or 'user'.
export default function ChatBubble({ from, text }) {
  return (
    <div className={`chat-row ${from}`}>
      {from === 'bot' && <div className="chat-avatar">🤖</div>}
      <div className={`chat-bubble ${from}`}>
        {text.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </div>
    </div>
  )
}
