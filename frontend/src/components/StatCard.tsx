import type { LucideIcon } from 'lucide-react'
export function StatCard({ label, value, detail, icon: Icon, tone = 'positive' }: { label: string; value: string | number; detail: string; icon: LucideIcon; tone?: 'positive' | 'warning' }) {
  return <div className="card stat-card"><div className="stat-top"><span>{label}</span><span className="metric-icon"><Icon size={16} /></span></div><div className="stat-value">{value}</div><span className={`trend ${tone}`}>{detail}</span></div>
}
