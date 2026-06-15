import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CATEGORY_COLORS } from '../constants/categories'

const COLORS = Object.values(CATEGORY_COLORS)

export function SpendingPie({ data }) {
  if (!data?.length) return <p className="text-sm text-slate-500 dark:text-slate-400">No expense data for this range.</p>
  return (
    <div className="h-72 w-full" role="img" aria-label="Spending by category pie chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => v} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SpendingBar({ data }) {
  if (!data?.length) return <p className="text-sm text-slate-500 dark:text-slate-400">No data for bar chart.</p>
  return (
    <div className="h-72 w-full" role="img" aria-label="Weekly spending bar chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="expense" fill="#0c94eb" radius={[6, 6, 0, 0]} name="Expenses" />
          <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} name="Income" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SpendingLine({ data }) {
  if (!data?.length) return <p className="text-sm text-slate-500 dark:text-slate-400">No trend data yet.</p>
  return (
    <div className="h-72 w-full" role="img" aria-label="Balance trend line chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={2} dot={false} name="Net" />
          <Line type="monotone" dataKey="expense" stroke="#f97316" strokeWidth={2} dot={false} name="Expenses" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
