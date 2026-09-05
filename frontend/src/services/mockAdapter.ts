import type { Alert, DashboardSummary, Device, Report, Shipment, TelemetryPoint } from '../types'
import axios from 'axios'
import { api } from './api'

const telemetry: TelemetryPoint[] = Array.from({ length: 12 }, (_, index) => ({
  timestamp: `${String(index + 8).padStart(2, '0')}:00`,
  temperature: Number((4.3 + Math.sin(index / 1.7) * 1.25 + (index === 7 ? 2.1 : 0)).toFixed(1)),
  humidity: Math.round(65 + Math.cos(index / 2) * 7),
}))

export const mockDevices: Device[] = [
  { id: 'dev-001', code: 'CTM-001-A', name: 'Reefer Alpha', type: 'Container sensor', location: 'Singapore Hub', status: 'online', temperature: 4.8, humidity: 68, battery: 92, lastSeen: 'Just now' },
  { id: 'dev-002', code: 'CTM-002-B', name: 'Cold Room 04', type: 'Fixed sensor', location: 'Jakarta DC', status: 'warning', temperature: 8.7, humidity: 71, battery: 76, lastSeen: '2 min ago' },
  { id: 'dev-003', code: 'CTM-003-C', name: 'Reefer Bravo', type: 'Container sensor', location: 'Port Klang', status: 'online', temperature: 3.9, humidity: 64, battery: 84, lastSeen: '4 min ago' },
  { id: 'dev-004', code: 'CTM-004-D', name: 'Transit Logger 12', type: 'Portable logger', location: 'Manila Route', status: 'offline', temperature: 6.1, humidity: 62, battery: 18, lastSeen: '46 min ago' },
  { id: 'dev-005', code: 'CTM-005-E', name: 'Cold Room 02', type: 'Fixed sensor', location: 'Bangkok DC', status: 'maintenance', temperature: 4.1, humidity: 66, battery: 100, lastSeen: '1 hr ago' },
]
export const mockShipments: Shipment[] = [
  { id: 'shp-1024', reference: 'SHP-2026-1024', origin: 'Singapore', destination: 'Tokyo', cargo: 'Vaccines · 1,240 units', status: 'in-transit', temperature: 4.6, eta: 'Today, 18:40', deviceId: 'dev-001' },
  { id: 'shp-1025', reference: 'SHP-2026-1025', origin: 'Jakarta', destination: 'Seoul', cargo: 'Fresh biologics · 860 units', status: 'delayed', temperature: 8.4, eta: 'Tomorrow, 09:15', deviceId: 'dev-002' },
  { id: 'shp-1023', reference: 'SHP-2026-1023', origin: 'Bangkok', destination: 'Sydney', cargo: 'Insulin · 2,100 units', status: 'delivered', temperature: 4.2, eta: 'Delivered yesterday', deviceId: 'dev-005' },
  { id: 'shp-1026', reference: 'SHP-2026-1026', origin: 'Manila', destination: 'Osaka', cargo: 'Lab samples · 320 units', status: 'pending', temperature: 5.2, eta: 'Sep 06, 11:30', deviceId: 'dev-004' },
]
export const mockAlerts: Alert[] = [
  { id: 'alt-1', title: 'Temperature above threshold', device: 'Cold Room 04', location: 'Jakarta DC', severity: 'critical', status: 'open', value: '8.7°C', createdAt: '8 min ago' },
  { id: 'alt-2', title: 'Device battery low', device: 'Transit Logger 12', location: 'Manila Route', severity: 'warning', status: 'investigating', value: '18%', createdAt: '46 min ago' },
  { id: 'alt-3', title: 'Shipment delayed', device: 'Reefer Bravo', location: 'Port Klang', severity: 'warning', status: 'open', value: '42 min', createdAt: '1 hr ago' },
  { id: 'alt-4', title: 'Temperature stabilized', device: 'Reefer Alpha', location: 'Singapore Hub', severity: 'normal', status: 'resolved', value: '4.8°C', createdAt: '2 hrs ago' },
]
export const mockReports: Report[] = [
  { id: 'rep-1', name: 'Weekly cold-chain compliance', type: 'Compliance', period: 'Aug 25 – Aug 31, 2026', generated: 'Sep 01, 2026', status: 'ready' },
  { id: 'rep-2', name: 'August shipment performance', type: 'Operations', period: 'Aug 01 – Aug 31, 2026', generated: 'Sep 01, 2026', status: 'ready' },
  { id: 'rep-3', name: 'Device health audit', type: 'Maintenance', period: 'Q3 2026', generated: 'Processing', status: 'processing' },
]

const wait = async <T>(data: T): Promise<T> => new Promise((resolve) => window.setTimeout(() => resolve(data), 220))

const shouldUseMockOnUnavailable = (error: unknown): boolean => axios.isAxiosError(error) && (!error.response || error.response.status >= 400)
const mapDevice = (item: Record<string, unknown>): Device => ({
  id: String(item.id),
  code: String(item.device_code ?? item.code ?? item.id),
  name: String(item.device_name ?? item.name ?? 'Unnamed device'),
  type: String(item.device_type ?? item.type ?? 'Sensor'),
  location: String(item.location ?? 'Not reported'),
  status: String(item.status ?? '').toLowerCase() === 'active' ? 'online' : 'offline',
  temperature: Number(item.temperature ?? 0),
  humidity: Number(item.humidity ?? 0),
  battery: Number(item.battery ?? 0),
  lastSeen: item.last_seen ? new Date(String(item.last_seen)).toLocaleString() : 'Not reported',
})

const mapTelemetry = (item: Record<string, unknown>): TelemetryPoint => ({
  timestamp: new Date(String(item.recorded_at ?? item.timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  temperature: Number(item.temperature),
  humidity: Number(item.humidity),
})

const mapAlert = (item: Record<string, unknown>): Alert => ({
  id: String(item.id),
  title: String(item.message ?? item.alert_type ?? 'Telemetry alert'),
  device: `Device ${String(item.device_id ?? '—')}`,
  location: 'Backend reported location',
  severity: String(item.severity ?? 'WARNING').toLowerCase() as Alert['severity'],
  status: String(item.status ?? 'UNRESOLVED').toLowerCase() === 'resolved' ? 'resolved' : 'open',
  value: item.temperature == null ? '—' : `${item.temperature}°C`,
  createdAt: item.created_at ? new Date(String(item.created_at)).toLocaleString() : 'Unknown',
})

export async function getDashboard(): Promise<DashboardSummary> {
  try {
    const [devicesResponse, telemetryResponse, alertsResponse] = await Promise.all([
      api.get<Record<string, unknown>[]>('/devices'),
      api.get<Record<string, unknown>[]>('/sensor-data'),
      api.get<Record<string, unknown>[]>('/alerts'),
    ])
    const devices = devicesResponse.data.map(mapDevice)
    const readings = telemetryResponse.data.map(mapTelemetry).reverse()
    const alerts = alertsResponse.data.map(mapAlert)
    return {
      totalDevices: devices.length,
      onlineDevices: devices.filter((device) => device.status === 'online').length,
      activeShipments: 0,
      openAlerts: alerts.filter((alert) => alert.status !== 'resolved').length,
      avgTemperature: readings.length ? readings.reduce((sum, point) => sum + point.temperature, 0) / readings.length : 0,
      telemetry: readings,
    }
  } catch (error: unknown) {
    if (!shouldUseMockOnUnavailable(error)) throw error
    return wait({ totalDevices: mockDevices.length, onlineDevices: mockDevices.filter((d) => d.status === 'online').length, activeShipments: mockShipments.filter((s) => s.status === 'in-transit').length, openAlerts: mockAlerts.filter((a) => a.status !== 'resolved').length, avgTemperature: 4.9, telemetry })
  }
}
export async function getDevices(): Promise<Device[]> {
  try {
    const response = await api.get<Record<string, unknown>[]>('/devices')
    return response.data.map(mapDevice)
  } catch (error: unknown) {
    if (!shouldUseMockOnUnavailable(error)) throw error
    return wait(mockDevices)
  }
}
export async function getDevice(id: string): Promise<Device | undefined> {
  const devices = await getDevices()
  return devices.find((device) => device.id === id)
}
export async function getShipments(): Promise<Shipment[]> {
  try {
    const response = await api.get<Shipment[]>('/shipments')
    return response.data
  } catch (error: unknown) {
    if (!shouldUseMockOnUnavailable(error)) throw error
    return wait(mockShipments)
  }
}
export async function getShipment(id: string): Promise<Shipment | undefined> {
  const shipments = await getShipments()
  return shipments.find((shipment) => shipment.id === id)
}
export async function getTelemetry(): Promise<TelemetryPoint[]> {
  try {
    const response = await api.get<Record<string, unknown>[]>('/sensor-data')
    return response.data.map(mapTelemetry).reverse()
  } catch (error: unknown) {
    if (!shouldUseMockOnUnavailable(error)) throw error
    return wait(telemetry)
  }
}
export async function getAlerts(): Promise<Alert[]> {
  try {
    const response = await api.get<Record<string, unknown>[]>('/alerts')
    return response.data.map(mapAlert)
  } catch (error: unknown) {
    if (!shouldUseMockOnUnavailable(error)) throw error
    return wait(mockAlerts)
  }
}
export async function getReports(): Promise<Report[]> { return wait(mockReports) }
