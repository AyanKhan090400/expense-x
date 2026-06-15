/** Tips & tricks knowledge base — expense tracking, budgeting, PKR savings only. */

export const FINANCIAL_TIPS = [
  'Pay yourself first: automate a small transfer to savings on payday.',
  'Review subscriptions monthly—unused services add up fast.',
  'Use the 50/30/20 rule as a starting point: 50% needs, 30% wants, 20% savings.',
  'Build a one-month emergency fund before chasing investment returns.',
  'Track every expense for two weeks to spot invisible spending leaks.',
  'Negotiate bills annually: internet, insurance, and phone plans often have retention deals.',
  'Avoid lifestyle creep when income rises—raise your savings rate instead.',
  'In PKR, round up daily spends in your head—it makes you pause before small purchases.',
  'Set a weekly cash envelope for dining out; when it is gone, cook at home.',
  'Use Expense X budgets with an 80% warning so you get alerts before overspending.',
  'Tag recurring bills in Transactions so Analytics shows your fixed costs clearly.',
  'Export CSV from Reports each month for a simple backup of your ledger.',
]

export const CHAT_QUICK_PROMPTS = [
  'How do I start budgeting?',
  'Tips to save money in PKR',
  'How to use Expense X?',
  'Reduce food spending',
  'Set saving goals',
]

export const TIPS_TOPICS = [
  {
    id: 'budget',
    keywords: ['budget', 'limit', 'cap', 'overspend', 'monthly', 'category'],
    tips: [
      'Create one budget per category you overspend on—Food, Transport, and Entertainment are good starters.',
      'Set the warn threshold to 80% in Budgets so Expense X alerts you before you hit the limit.',
      'Review budget progress every Sunday; small weekly check-ins beat one big monthly surprise.',
      'Use the "__all__" style thinking: know your top 3 categories, then cap those first.',
    ],
  },
  {
    id: 'save',
    keywords: ['save', 'saving', 'savings', 'emergency', 'fund', 'pasa', 'paisa', 'bachat'],
    tips: [
      'Start with a Rs 10,000–25,000 mini emergency fund, then grow it to 3 months of expenses.',
      'Automate savings on salary day—even Rs 2,000/month compounds your habit.',
      'Use Goals in Expense X with a deadline; visible progress bars keep motivation high.',
      'Before any non-essential purchase over Rs 5,000, wait 24 hours—most impulse buys fade.',
    ],
  },
  {
    id: 'track',
    keywords: ['track', 'log', 'record', 'transaction', 'daily', 'habit', 'receipt'],
    tips: [
      'Log expenses the same day—memory fades and amounts get rounded wrong.',
      'Use voice input on the Transactions page when you are on the go.',
      'Add notes and tags to large purchases so Reports and Analytics stay meaningful.',
      'Upload receipts for warranty items and business expenses—you will thank yourself later.',
    ],
  },
  {
    id: 'food',
    keywords: ['food', 'grocery', 'restaurant', 'dining', 'khana', 'groceries', 'eat'],
    tips: [
      'Meal-plan on Sunday and shop once—extra store trips usually mean extra snacks.',
      'Food delivery apps add fees and tips; cooking twice more per week often saves 15–20%.',
      'Set a Food budget in Expense X and check Analytics pie chart weekly.',
      'Pack lunch 3 days a week—a simple habit with big PKR impact over a month.',
    ],
  },
  {
    id: 'bills',
    keywords: ['bill', 'utility', 'electric', 'gas', 'internet', 'subscription', 'recurring'],
    tips: [
      'Mark recurring expenses in Transactions so upcoming bills show on the Dashboard.',
      'Audit subscriptions every quarter—streaming, cloud storage, and apps pile up quietly.',
      'Compare internet and mobile plans yearly; retention teams often offer better PKR rates.',
      'Pay utility bills before the due date to avoid late fees that look small but add up.',
    ],
  },
  {
    id: 'goals',
    keywords: ['goal', 'target', 'deadline', 'milestone', 'plan'],
    tips: [
      'Split big goals into smaller targets—Rs 50,000 feels easier as 5 × Rs 10,000 chunks.',
      'Give every goal a realistic deadline; open-ended goals rarely get funded.',
      'Update "saved so far" weekly in Goals—even manual updates build accountability.',
      'Celebrate 25%, 50%, and 75% milestones with something free, not something expensive.',
    ],
  },
  {
    id: 'app',
    keywords: ['expense x', 'app', 'feature', 'dashboard', 'analytics', 'report', 'export', 'use', 'how'],
    tips: [
      'Dashboard shows month income, expenses, and savings—check it every Monday.',
      'Analytics pie chart reveals category leaks; bar chart compares this week day by day.',
      'Create custom categories in Profile for local spends like "Bazaar" or "Rickshaw".',
      'Use dark mode and notifications from Profile and the header bell icon.',
      'Export CSV/PDF from Reports for tax season or sharing with a family member.',
    ],
  },
  {
    id: 'pkr',
    keywords: ['pkr', 'rupee', 'rs', 'pakistan', 'pakistani', 'salary'],
    tips: [
      'Think in monthly PKR buckets: rent, utilities, groceries, transport, savings, fun money.',
      'Keep one day of expenses in an easy-access account; the rest can sit in savings.',
      'Track cash spending too—small Rs 100–500 purchases disappear without logs.',
      'When prices rise, adjust budgets in Expense X instead of silently overspending.',
    ],
  },
  {
    id: 'debt',
    keywords: ['debt', 'loan', 'credit', 'card', 'interest', 'emi', 'installment'],
    tips: [
      'List every debt with its interest rate—attack the highest rate first (avalanche method).',
      'Never miss minimum payments; late fees in PKR can exceed a meal out.',
      'Avoid new EMI for wants while old debt is active—finish one line before opening another.',
      'Track loan payments as recurring expenses so your monthly picture stays honest.',
    ],
  },
  {
    id: 'family',
    keywords: ['family', 'household', 'shared', 'wife', 'husband', 'parents', 'ghar'],
    tips: [
      'Agree on one shared category list so everyone logs spends the same way.',
      'Review Analytics together monthly—visibility reduces "where did the money go?" fights.',
      'Assign one person to update Goals, another to verify Transactions—light division helps.',
      'Keep a small "family fun" budget so guilt-free outings do not wreck the plan.',
    ],
  },
]

export const OFF_TOPIC_REPLY =
  'I only help with expense tracking, budgeting, saving tips, and using Expense X. Try asking about budgets, PKR savings, food spending, or app features.'

export const GREETING_REPLY =
  'Hi! I am your Expense X tips assistant. Ask me about budgeting, saving in PKR, tracking habits, or how to use the app. Pick a quick prompt below or type your question.'

export const FALLBACK_REPLY =
  'Here are practical tips: log expenses daily, set category budgets with 80% alerts, and review Analytics weekly. Ask about something specific—budget, food, goals, bills, or PKR savings.'
