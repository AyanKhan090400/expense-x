import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExpenseData } from '../context/ExpenseDataContext'
import { CHAT_QUICK_PROMPTS, GREETING_REPLY, getTipsReply } from '../utils/tipsChatbot'

function ChatMessage({ role, text }) {
  const isBot = role === 'bot'
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isBot
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-md'
            : 'bg-brand-600 text-white rounded-br-md'
        }`}
      >
        {text}
      </div>
    </div>
  )
}

export function TipsChatbot() {
  const { transactions } = useExpenseData()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [prompts, setPrompts] = useState(CHAT_QUICK_PROMPTS)
  const [messages, setMessages] = useState([{ id: 'welcome', role: 'bot', text: GREETING_REPLY }])
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, open, typing])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = (text) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: trimmed }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    window.setTimeout(() => {
      const { reply, quickPrompts } = getTipsReply(trimmed, { transactions })
      setMessages((m) => [...m, { id: `b-${Date.now()}`, role: 'bot', text: reply }])
      setPrompts(quickPrompts)
      setTyping(false)
    }, 450)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 z-50 flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
            role="dialog"
            aria-label="Expense X tips assistant"
          >
            <header className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 bg-brand-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl" aria-hidden>
                  🤖
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">Expense X Tips Agent</p>
                  <p className="text-[11px] text-brand-100 truncate">Budget · Save · Track · PKR</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/15 transition-colors"
                aria-label="Close tips chat"
              >
                ✕
              </button>
            </header>

            <div ref={listRef} className="flex-1 max-h-80 overflow-y-auto p-3 space-y-3">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role} text={msg.text} />
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                    Typing…
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 p-3 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {prompts.slice(0, 3).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  send(input)
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a money tip…"
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  maxLength={300}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
                >
                  Send
                </button>
              </form>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                Tips only — not financial advice. Uses your recent data when logged in.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white text-2xl shadow-lg shadow-brand-600/30 border-2 border-white dark:border-slate-800"
        aria-label={open ? 'Close tips assistant' : 'Open tips assistant'}
        aria-expanded={open}
      >
        {open ? '✕' : '💡'}
      </motion.button>
    </>
  )
}
