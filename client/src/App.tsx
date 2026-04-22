import { useState } from 'react'
import HomePage from './HomePage'
import ProjectsPage from './ProjectsPage'
import TodosPage from './TodosPage'
import NotesPage from './NotesPage'

type Page = 'home' | 'todos' | 'notes' | 'projects'

function App() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'projects') return <ProjectsPage onBack={() => setPage('home')} />
  if (page === 'todos') return <TodosPage onBack={() => setPage('home')} />
  if (page === 'notes') return <NotesPage onBack={() => setPage('home')} />

  return <HomePage onNavigate={(dest) => setPage(dest as Page)} />
}

export default App
