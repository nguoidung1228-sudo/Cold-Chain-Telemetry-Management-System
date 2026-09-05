import { Download, FileBarChart, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getReports } from '../services/mockAdapter'
import type { Report } from '../types'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { LoadingState } from '../components/LoadingState'
export function ReportsPage() { const [reports, setReports] = useState<Report[]>([]); useEffect(() => { void getReports().then(setReports) }, []); return <div className="data-page"><PageHeader eyebrow="Insights & exports" title="Reports" description="Turn your cold-chain data into clear operational decisions." action={<button className="btn btn-primary"><Plus size={15} /> Generate report</button>} /><div className="card"><div className="table-wrap">{reports.length === 0 ? <LoadingState /> : <table><thead><tr><th>Report</th><th>Type</th><th>Period</th><th>Generated</th><th>Status</th><th /></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td><div className="device-name"><span className="avatar"><FileBarChart size={15} /></span>{report.name}</div></td><td>{report.type}</td><td>{report.period}</td><td>{report.generated}</td><td><StatusBadge value={report.status} /></td><td>{report.status === 'ready' && <button className="btn"><Download size={14} /> CSV</button>}</td></tr>)}</tbody></table>}</div></div></div> }
