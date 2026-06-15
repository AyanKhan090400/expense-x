import { Helmet } from 'react-helmet-async'

export function SEO({ title, description, path = '' }) {
  const site = 'Expense X'
  const fullTitle = title ? `${title} | ${site}` : `${site} — Expense Tracker`
  const desc =
    description ||
    'Track spending, budgets, and goals with Expense X — a modern expense tracker powered by Firebase.'
  const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : ''

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
    </Helmet>
  )
}
