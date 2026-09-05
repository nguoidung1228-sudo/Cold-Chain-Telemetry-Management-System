import { Search, SlidersHorizontal } from 'lucide-react'
export function Filters({ search, onSearch, placeholder = 'Search records…', children }: { search: string; onSearch: (value: string) => void; placeholder?: string; children?: React.ReactNode }) {
  return <div className="toolbar"><div className="search"><Search size={16} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={placeholder} /></div>{children}<button className="btn" type="button"><SlidersHorizontal size={15} /> Filters</button></div>
}
