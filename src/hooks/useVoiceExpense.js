import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

/**
 * Web Speech API: parses simple phrases like "coffee 12 food" or "spent 25 on transport".
 */
export function useVoiceExpense() {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(
    () => typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
  )

  const listen = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      toast.error('Voice input is not supported in this browser.')
      setSupported(false)
      return Promise.reject(new Error('no-speech'))
    }

    return new Promise((resolve, reject) => {
      const rec = new SR()
      rec.lang = 'en-US'
      rec.interimResults = false
      rec.maxAlternatives = 1
      setListening(true)
      rec.onresult = (ev) => {
        const text = ev.results[0][0].transcript || ''
        setListening(false)
        resolve(parseVoiceExpense(text))
      }
      rec.onerror = () => {
        setListening(false)
        toast.error('Could not capture voice. Try again.')
        reject(new Error('speech-error'))
      }
      rec.onend = () => setListening(false)
      rec.start()
    })
  }, [])

  return { listen, listening, supported }
}

export function parseVoiceExpense(text) {
  const raw = text.toLowerCase().trim()
  const amountMatch = raw.match(/(\d+(\.\d+)?)/)
  const amount = amountMatch ? parseFloat(amountMatch[1]) : NaN
  let title = raw.replace(amountMatch?.[0] || '', '').trim()
  title = title.replace(/\b(on|for|spent|paid|buy|bought)\b/gi, ' ').trim()
  if (!title) title = 'Voice expense'

  const categories = [
    'food',
    'transport',
    'shopping',
    'bills',
    'education',
    'health',
    'entertainment',
    'travel',
    'investment',
    'freelance',
    'salary',
  ]
  let category = 'Others'
  for (const c of categories) {
    if (raw.includes(c)) {
      category = c.charAt(0).toUpperCase() + c.slice(1)
      break
    }
  }

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    amount: Number.isNaN(amount) ? '' : String(amount),
    category,
    type: ['salary', 'freelance', 'investment'].includes(category.toLowerCase()) ? 'income' : 'expense',
    notes: `Added by voice: "${text}"`,
  }
}
