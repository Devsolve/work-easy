import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import CapitalizePage from './pages/CapitalizePage'

export default function App() {
  const [page, setPage] = useState('format')
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64">
          <Sidebar onSelect={setPage} />
        </div>
        <main className="flex-1">
          {page === 'format' && <CapitalizePage />}
        </main>
      </div>
    </div>
  )
}