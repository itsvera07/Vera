type Message = { text: string; sender: 'self' | 'other'; timestamp?: string | null }

export function ChatBubbles({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-snug ${
              m.sender === 'self'
                ? 'bg-brand-orange text-white rounded-br-sm'
                : 'bg-white text-ink rounded-bl-sm shadow-card'
            }`}
          >
            {m.text}
            {m.timestamp && (
              <div className={`text-[10px] mt-1 ${m.sender === 'self' ? 'text-white/70' : 'text-ink-muted'}`}>
                {m.timestamp}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
