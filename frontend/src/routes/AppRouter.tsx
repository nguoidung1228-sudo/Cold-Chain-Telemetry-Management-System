import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { DevicesPage } from '../pages/DevicesPage'
import { DeviceDetailPage } from '../pages/DeviceDetailPage'
import { ShipmentsPage } from '../pages/ShipmentsPage'
import { ShipmentDetailPage } from '../pages/ShipmentDetailPage'
import { TelemetryPage } from '../pages/TelemetryPage'
import { AlertsPage } from '../pages/AlertsPage'
import { ReportsPage } from '../pages/ReportsPage'
import { SettingsPage } from '../pages/SettingsPage'
export function AppRouter({ isAuthenticated }: { isAuthenticated: boolean }) {
  const guard = (element: React.ReactElement) => isAuthenticated ? element : <Navigate to="/login" replace />
  return <Routes><Route path="/login" element={<LoginPage />} /><Route path="/dashboard" element={guard(<DashboardPage />)} /><Route path="/devices" element={guard(<DevicesPage />)} /><Route path="/devices/:id" element={guard(<DeviceDetailPage />)} /><Route path="/shipments" element={guard(<ShipmentsPage />)} /><Route path="/shipments/:id" element={guard(<ShipmentDetailPage />)} /><Route path="/telemetry" element={guard(<TelemetryPage />)} /><Route path="/alerts" element={guard(<AlertsPage />)} /><Route path="/reports" element={guard(<ReportsPage />)} /><Route path="/settings" element={guard(<SettingsPage />)} /><Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} /></Routes>
}
