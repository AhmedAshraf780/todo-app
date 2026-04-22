import { useState } from 'react'
import HomePage from './HomePage'
import ProjectsPage from './ProjectsPage'

type Page = 'home' | 'todos' | 'notes' | 'projects'

function App() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'projects') return <ProjectsPage onBack={() => setPage('home')} />

  // todos / notes pages can be added later
  return <HomePage onNavigate={(dest) => setPage(dest as Page)} />
}

export default App
