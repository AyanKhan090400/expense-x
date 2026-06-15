import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ROUTES } from '../constants/routes'
import { Button } from '../components/Button'
import { SEO } from '../components/SEO'

const features = [
  {
    title: 'Realtime dashboard',
    desc: 'Balances, cash flow, and savings at a glance with polished cards and motion.',
    icon: '📊',
  },
  {
    title: 'Receipts in the cloud',
    desc: 'Upload receipts to Firebase Storage with secure, user-scoped access rules.',
    icon: '🧾',
  },
  {
    title: 'Budgets that warn you',
    desc: 'Set limits per category, track progress, and get in-app alerts before you overspend.',
    icon: '🎯',
  },
  {
    title: 'Goals with deadlines',
    desc: 'Target amounts, deadlines, and progress bars keep savings concrete.',
    icon: '🏆',
  },
  {
    title: 'Analytics you will use',
    desc: 'Pie, bar, and line charts for weekly and monthly narratives — powered by Recharts.',
    icon: '📈',
  },
  {
    title: 'Voice & smart tips',
    desc: 'Add expenses with your voice and surface heuristic spending suggestions instantly.',
    icon: '🎙️',
  },
]

const testimonials = [
  {
    quote: 'Finally replaced my spreadsheet. Dark mode and mobile menu feel premium.',
    name: 'Aisha K.',
    role: 'Freelance designer',
  },
  {
    quote: 'Budget warnings saved me twice last month. Export to CSV is clutch for taxes.',
    name: 'Marcus L.',
    role: 'Small business owner',
  },
]

const faqs = [
  {
    q: 'Is my data private?',
    a: 'Firestore security rules isolate data per account. Storage paths are scoped to your user ID.',
  },
  {
    q: 'Which currency is used?',
    a: 'All amounts are tracked in Pakistani Rupees (PKR). Enter values in rupees — no conversion needed.',
  },
  {
    q: 'Does this work offline?',
    a: 'This build targets online-first Firebase. You can extend with persistence later.',
  },
]

export function Home() {
  return (
    <>
      <SEO
        title="Personal finance clarity"
        description="Expense X — budgets, goals, analytics, and secure Firebase-backed expense tracking."
        path="/"
      />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/80 via-transparent to-transparent dark:from-brand-900/30" />
        <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-20 lg:px-6 lg:pt-20 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-800 bg-white/70 dark:bg-slate-900/70 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                <span aria-hidden>✨</span> Firebase-ready finance OS
              </p>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Your money, <span className="text-gradient">finally organized</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl">
                Track expenses, plan budgets, crush savings goals, and export beautiful reports — with
                authentication, dark mode, and a dashboard that feels as good as it looks.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={ROUTES.register}>
                  <Button size="lg">Start free</Button>
                </Link>
                <a href="#features">
                  <Button variant="secondary" size="lg">
                    Explore features
                  </Button>
                </a>
              </div>
              <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                {[
                  ['99.9%', 'Uptime ready'],
                  ['< 2s', 'Avg. sync'],
                  ['256-bit', 'TLS in transit'],
                ].map(([k, v]) => (
                  <div key={v}>
                    <dt className="text-xl font-bold text-slate-900 dark:text-white">{k}</dt>
                    <dd className="text-xs text-slate-500 dark:text-slate-400">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/20 via-cyan-400/10 to-emerald-400/20 blur-3xl rounded-[2rem]" />
              <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Overview</p>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+12.4%</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Income', '$4,250', 'text-emerald-600'],
                    ['Expenses', '$2,980', 'text-orange-500'],
                    ['Savings', '$1,270', 'text-brand-600'],
                    ['Goals', '3 active', 'text-slate-500 dark:text-slate-400'],
                  ].map(([l, v, c]) => (
                    <div key={l} className="rounded-2xl bg-slate-50 dark:bg-slate-950/50 p-3 border border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{l}</p>
                      <p className={`text-lg font-bold ${c}`}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="h-28 rounded-2xl bg-gradient-to-r from-brand-500/10 to-cyan-500/10 border border-dashed border-brand-200/60 dark:border-brand-900/50 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  Live charts in the app →
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20 lg:px-6 scroll-mt-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Everything you asked for</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Production-minded structure with reusable components, hooks, and secure Firebase rules.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl" aria-hidden>
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-slate-100/80 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-20 lg:px-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center">Loved by early adopters</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
              >
                <p className="text-slate-700 dark:text-slate-200">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                  {t.name}
                  <span className="font-normal text-slate-500 dark:text-slate-400"> — {t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-4 py-20 lg:px-6 scroll-mt-24">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">FAQ</h2>
        <div className="mt-8 space-y-4 max-w-3xl">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 open:shadow-md"
            >
              <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white list-none flex justify-between gap-4">
                {f.q}
                <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 lg:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-cyan-600 p-10 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold">Ready to feel in control?</h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">
            Create your account, connect Firebase, and ship your personal finance hub today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={ROUTES.register}>
              <Button className="!bg-white !text-brand-700 hover:!bg-slate-100" size="lg">
                Create account
              </Button>
            </Link>
            <Link to={ROUTES.login}>
              <Button variant="ghost" className="!text-white border border-white/40 hover:!bg-white/10" size="lg">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
