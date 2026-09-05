import { TEMP_MAX, TEMP_MIN } from '../constants'
export function temperatureState(value: number): 'normal' | 'warning' | 'critical' {
  if (value < TEMP_MIN - 2 || value > TEMP_MAX + 2) return 'critical'
  if (value < TEMP_MIN || value > TEMP_MAX) return 'warning'
  return 'normal'
}
