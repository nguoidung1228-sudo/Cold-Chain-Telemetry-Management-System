import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TelemetryPoint } from '../types'
export function TelemetryChart({ data }: { data: TelemetryPoint[] }) {
  return <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}><CartesianGrid stroke="#edf2f5" vertical={false} /><XAxis dataKey="timestamp" tick={{ fill: '#8b9aaa', fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis domain={[0, 10]} tick={{ fill: '#8b9aaa', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e4edf3', fontSize: 12 }} /><Line type="monotone" dataKey="temperature" stroke="#2878c8" strokeWidth={3} dot={false} name="Temperature °C" /><Line type="monotone" dataKey="humidity" stroke="#16a6a1" strokeWidth={2} dot={false} name="Humidity %" /></LineChart></ResponsiveContainer></div>
}
