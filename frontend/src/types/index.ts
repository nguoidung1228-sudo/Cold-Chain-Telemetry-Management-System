export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'warning'
export type ShipmentStatus = 'in-transit' | 'delivered' | 'delayed' | 'pending'
export type AlertSeverity = 'critical' | 'warning' | 'normal'
export type AlertStatus = 'open' | 'investigating' | 'resolved'

export interface Device { id: string; code: string; name: string; type: string; location: string; status: DeviceStatus; temperature: number; humidity: number; battery: number; lastSeen: string }
export interface Shipment { id: string; reference: string; origin: string; destination: string; cargo: string; status: ShipmentStatus; temperature: number; eta: string; deviceId: string }
export interface TelemetryPoint { timestamp: string; temperature: number; humidity: number }
export interface Alert { id: string; title: string; device: string; location: string; severity: AlertSeverity; status: AlertStatus; value: string; createdAt: string }
export interface DashboardSummary { totalDevices: number; onlineDevices: number; activeShipments: number; openAlerts: number; avgTemperature: number; telemetry: TelemetryPoint[] }
export interface Report { id: string; name: string; type: string; period: string; generated: string; status: 'ready' | 'processing' }
