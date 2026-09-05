export function LoadingState({ label = 'Loading telemetry…' }: { label?: string }) { return <div className="loading">{label}</div> }
export function EmptyState({ label = 'No records found.' }: { label?: string }) { return <div className="empty">{label}</div> }
export function ErrorState({ label = 'Unable to load records.' }: { label?: string }) { return <div className="error">{label}</div> }
