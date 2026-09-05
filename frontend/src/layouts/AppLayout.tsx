import type { ReactNode } from 'react'
import { useState } from 'react'
import { Bell, ChevronDown, LayoutDashboard, Menu, RadioTower, Package, Activity, BellRing, FileBarChart, Settings, Snowflake } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { navItems } from '../constants'
import { useAuthStore } from '../stores/authStore'
import '../App.css'

const icons = { LayoutDashboard, RadioTower, Package, Activity, BellRing, FileBarChart }
export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate(); const location = useLocation()
  if (!isAuthenticated && location.pathname !== '/login') return <>{children}</>
  if (location.pathname === '/login') return <>{children}</>
  return <div className="app-shell"><aside className={`sidebar ${open ? 'open' : ''}`}><div className="brand"><span className="brand-mark"><Snowflake size={20} /></span>Cold Chain<span style={{ color: '#67d4cb' }}>.</span></div><div className="nav-section">Workspace</div><nav className="nav-list">{navItems.map((item) => { const Icon = icons[item.icon as keyof typeof icons]; return <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}><Icon size={18} />{item.label}</NavLink> })}</nav><div className="nav-section" style={{ marginTop: 28 }}>Account</div><NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Settings size={18} />Settings</NavLink><div className="sidebar-footer"><div className="user-mini"><span className="avatar">AM</span><span><strong style={{ color: '#fff' }}>{user?.name ?? 'Alex Morgan'}</strong><br /><small>{user?.role ?? 'Operations lead'}</small></span><ChevronDown size={14} style={{ marginLeft: 'auto' }} /></div><button className="nav-link" style={{ border: 0, background: 'none', width: '100%', marginTop: 12, color: '#a9bed0' }} onClick={() => { logout(); navigate('/login') }}>Sign out</button></div></aside><section className="main-area"><header className="topbar"><button className="icon-button mobile-toggle" onClick={() => setOpen(!open)}><Menu size={20} /></button><span style={{ color: '#718399', fontSize: 13 }}>{location.pathname === '/dashboard' ? 'Cold-chain operations overview' : 'Cold Chain Telemetry workspace'}</span><div className="topbar-actions"><button className="icon-button"><Bell size={19} /><span className="notification-dot" /></button><span className="avatar">AM</span></div></header><main className="page-content">{children}</main></section></div>
}
