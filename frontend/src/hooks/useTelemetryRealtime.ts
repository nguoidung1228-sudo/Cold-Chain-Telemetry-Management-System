import { useEffect, useState } from 'react'
import type { TelemetryPoint } from '../types'
import { getTelemetry } from '../services/mockAdapter'

export function useTelemetryRealtime(interval = 30000) {
  const [data, setData] = useState<TelemetryPoint[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    const refresh = async () => { const next = await getTelemetry(); if (active) { setData(next); setLoading(false) } }
    void refresh()
    const timer = window.setInterval(() => void refresh(), interval)
    return () => { active = false; window.clearInterval(timer) }
  }, [interval])
  return { data, loading, isLive: true }
}
