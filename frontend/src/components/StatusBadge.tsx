import type { AlertSeverity, AlertStatus, DeviceStatus, ShipmentStatus } from '../types'
type Status = DeviceStatus | ShipmentStatus | AlertSeverity | AlertStatus | 'ready' | 'processing'
export function StatusBadge({ value }: { value: Status }) { return <span className={`status ${value}`}>{value.replace('-', ' ')}</span> }
