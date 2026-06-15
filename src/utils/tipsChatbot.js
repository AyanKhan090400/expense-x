import { subDays } from 'date-fns'
import {
  CHAT_QUICK_PROMPTS,
  FALLBACK_REPLY,
  FINANCIAL_TIPS,
  GREETING_REPLY,
  OFF_TOPIC_REPLY,
  TIPS_TOPICS,
} from '../constants/financialTips'

const OFF_TOPIC_KEYWORDS = [
  'weather',
  'cricket',
  'football',
  'movie',
  'song',
  'recipe',
  'code',
  'programming',
  'python',
  'javascript',
  'politics',
  'news',
  'joke',
  'poem',
  'translate',
  'homework',
  'math problem',
  'who is',
  'what is the capital',
]

const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'salam', 'assalam', 'start', 'help']

function normalize(text) {
  return text.toLowerCase().trim()
}

function scoreTopic(text, topic) {
  let score = 0
  for (const kw of topic.keywords) {
    if (text.includes(kw)) score += kw.length > 4 ? 2 : 1
  }
  return score
}

function isOffTopic(text) {
  if (text.length < 2) return false
  const financeHint = TIPS_TOPICS.some((t) => scoreTopic(text, t) > 0)
  if (financeHint) return false
  return OFF_TOPIC_KEYWORDS.some((kw) => text.includes(kw))
}

function isGreeting(text) {
  if (text.length > 40) return false
  return GREETING_KEYWORDS.some((g) => text === g || text.startsWith(`${g} `))
}

function pickRandom(items, count = 2) {
  const copy = [...items]
  const out = []
  while (copy.length && out.length < count) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return out
}

function personalize(transactions) {
  if (!transactions?.length) {
    return 'You have no transactions yet—add your first expense today and check Dashboard tomorrow for insights.'
  }

  const cutoff = subDays(new Date(), 30)
  const recent = transactions.filter((t) => new Date(t.date) >= cutoff)
  const expenses = recent.filter((t) => t.type === 'expense')

  if (expenses.length === 0) {
    return 'No expenses in the last 30 days—keep logging so Analytics and smart suggestions stay useful.'
  }

  const byCat = {}
  let total = 0
  for (const t of expenses) {
    byCat[t.category] = (byCat[t.category] || 0) + Number(t.amount)
    total += Number(t.amount)
  }

  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]
  if (top && total > 0) {
    const pct = Math.round((top[1] / total) * 100)
    return `Based on your last 30 days: ${top[0]} is about ${pct}% of spending (Rs ${Math.round(top[1]).toLocaleString('en-PK')}). Consider a budget cap for that category.`
  }

  return null
}

/**
 * Rule-based tips agent — expense tracking & money habits only (no external API).
 */
export function getTipsReply(message, { transactions } = {}) {
  const text = normalize(message)
  if (!text) return { reply: 'Type a question about budgeting, saving, or using Expense X.', quickPrompts: CHAT_QUICK_PROMPTS }

  if (isGreeting(text)) {
    return { reply: GREETING_REPLY, quickPrompts: CHAT_QUICK_PROMPTS }
  }

  if (isOffTopic(text)) {
    return { reply: OFF_TOPIC_REPLY, quickPrompts: CHAT_QUICK_PROMPTS }
  }

  const ranked = TIPS_TOPICS.map((topic) => ({ topic, score: scoreTopic(text, topic) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  const personal = personalize(transactions)
  const tips = []

  if (ranked.length) {
    const best = ranked[0].topic
    tips.push(...pickRandom(best.tips, 2))
    if (ranked[1]) tips.push(pickRandom(ranked[1].topic.tips, 1)[0])
  } else {
    tips.push(...pickRandom(FINANCIAL_TIPS, 2))
  }

  const uniqueTips = [...new Set(tips.filter(Boolean))]
  let reply = uniqueTips.map((t, i) => `${i + 1}. ${t}`).join('\n\n')

  if (personal) {
    reply = `${personal}\n\n${reply}`
  }

  if (!ranked.length && !personal) {
    reply = `${FALLBACK_REPLY}\n\n${reply}`
  }

  return { reply, quickPrompts: CHAT_QUICK_PROMPTS }
}

export { CHAT_QUICK_PROMPTS, GREETING_REPLY }
