import { useState, useEffect, useCallback, type FormEvent, type KeyboardEvent } from 'react'
import todosService, { type Todo } from './services/todos'
import './TodosPage.css'

// ── Icons ────────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
)

interface Props {
  onBack: () => void
}

export default function TodosPage({ onBack }: Props) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  // Derived state for stats
  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  // Fetch all todos
  const fetchTodos = useCallback(async () => {
    setLoading(true)
    try {
      const data = await todosService.getAll()
      setTodos(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  // Add new todo
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return
    setAdding(true)
    try {
      const created = await todosService.create(newTodo.trim())
      // Add to the top
      setTodos(prev => [created, ...prev])
      setNewTodo('')
    } finally {
      setAdding(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTodo()
    }
  }

  // Toggle complete
  const handleToggle = async (todo: Todo) => {
    // Optimistic update
    const nextCompleted = !todo.completed
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: nextCompleted } : t))

    try {
      await todosService.update(todo.id, nextCompleted)
    } catch {
      // Revert on failure
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: todo.completed } : t))
    }
  }

  // Delete todo
  const handleDelete = async (id: number | string) => {
    // Optimistic update
    const previousTodos = [...todos]
    setTodos(prev => prev.filter(t => t.id !== id))

    try {
      await todosService.delete(id)
    } catch {
      // Revert on failure
      setTodos(previousTodos)
    }
  }

  return (
    <div className="tp">
      {/* Background */}
      <div className="tp__bg">
        <div className="tp__orb tp__orb--1" />
        <div className="tp__orb tp__orb--2" />
      </div>

      <div className="tp__inner">
        {/* Top bar */}
        <div className="tp__topbar">
          <button id="todos-back-btn" className="tp__back" onClick={onBack}>
            <BackIcon /> <span>Home</span>
          </button>
          <h1 className="tp__title">Todos</h1>
        </div>

        <div className="tp__layout">
          <div className="tp__main">

            {/* Add Todo Input */}
            <div className="tp__add-wrap">
              <div className="tp__add-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <input
                id="todo-input"
                className="tp__input"
                type="text"
                placeholder="What needs to be done today?"
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={adding}
                autoFocus
              />
              <button
                className="tp__btn tp__btn--primary"
                onClick={handleAddTodo}
                disabled={adding || !newTodo.trim()}
              >
                {adding ? <span className="tp__spinner" /> : 'Add Task'}
              </button>
            </div>

            {/* Stats / Progress */}
            {todos.length > 0 && (
              <div className="tp__stats-card">
                <div className="tp__stats-header">
                  <span className="tp__stats-title">Progress</span>
                  <span className="tp__stats-percent">{progressPercent}%</span>
                </div>
                <div className="tp__progress-track">
                  <div
                    className="tp__progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="tp__stats-meta">
                  {completedCount} of {totalCount} completed
                  {completedCount > 0 && (
                    <button
                      className="tp__clear-btn"
                      onClick={() => todos.filter(t => t.completed).forEach(t => handleDelete(t.id))}
                    >
                      Clear completed
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* List */}
            {loading ? (
              <div className="tp__loading">
                <span className="tp__spinner tp__spinner--lg" />
                <span>Loading your tasks…</span>
              </div>
            ) : todos.length === 0 ? (
              <div className="tp__empty">
                <div className="tp__empty-illustration">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h3>You're all caught up!</h3>
                <p>No tasks remaining. Enjoy your day or add a new task above.</p>
              </div>
            ) : (
              <div className="tp__list">
                {todos.map((todo, i) => (
                  <div
                    key={todo.id}
                    className={`tp__todo-card ${todo.completed ? 'tp__todo-card--completed' : ''}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <label className="tp__checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggle(todo)}
                        className="tp__checkbox-input"
                      />
                      <span className="tp__checkbox-custom">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </label>

                    <div className="tp__todo-body">
                      <span className="tp__todo-title">
                        {todo.title || todo.name}
                      </span>
                    </div>

                    <button
                      className="tp__icon-btn tp__icon-btn--delete"
                      title="Delete"
                      onClick={() => handleDelete(todo.id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
