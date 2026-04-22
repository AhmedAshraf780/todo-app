import { useState, useEffect, useCallback, type KeyboardEvent } from 'react'
import notesService, { type Note } from './services/notes'
import './NotesPage.css'

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

export default function NotesPage({ onBack }: Props) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await notesService.getAll()
      // Reverse to show newest at the top
      setNotes([...data].reverse())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // Add new note
  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setAdding(true)
    try {
      const created = await notesService.create(newNote.trim())
      // Add to the top
      setNotes(prev => [created, ...prev])
      setNewNote('')
    } catch (err) {
      console.error(err)
    } finally {
      setAdding(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddNote()
    }
  }

  // Toggle complete
  const handleToggle = async (note: Note) => {
    const isCompleted = note.content === 'completed'
    const nextCompleted = !isCompleted

    // Optimistic update
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, content: nextCompleted ? 'completed' : 'pending' } : n))

    try {
      await notesService.updateCompletion(note.id, nextCompleted)
    } catch {
      // Revert on failure
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, content: note.content } : n))
    }
  }

  // Delete note
  const handleDelete = async (id: number) => {
    // Optimistic update
    const previousNotes = [...notes]
    setNotes(prev => prev.filter(n => n.id !== id))

    try {
      await notesService.delete(id)
    } catch {
      // Revert on failure
      setNotes(previousNotes)
    }
  }

  return (
    <div className="np">
      {/* Background */}
      <div className="np__bg">
        <div className="np__orb np__orb--1" />
        <div className="np__orb np__orb--2" />
      </div>

      <div className="np__inner">
        {/* Top bar */}
        <div className="np__topbar">
          <button className="np__back" onClick={onBack}>
            <BackIcon /> <span>Home</span>
          </button>
          <h1 className="np__title">Notes</h1>
        </div>

        <div className="np__main">
          {/* Add Note Input */}
          <div className="np__add-wrap">
            <div className="np__add-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <input
              className="np__input"
              type="text"
              placeholder="What's on your mind?"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={adding}
              autoFocus
            />
            <button
              className="np__btn"
              onClick={handleAddNote}
              disabled={adding || !newNote.trim()}
            >
              {adding ? <span className="np__spinner" /> : 'Add Note'}
            </button>
          </div>

          {/* List */}
          {loading ? (
            <div className="np__loading">
              <span className="np__spinner np__spinner--lg" />
              <span>Loading your notes…</span>
            </div>
          ) : notes.length === 0 ? (
            <div className="np__empty">
              <div style={{ opacity: 0.5, marginBottom: '16px' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3>No notes yet</h3>
              <p>Capture your first thought above.</p>
            </div>
          ) : (
            <div className="np__list">
              {notes.map((note, i) => {
                const isCompleted = note.content === 'completed';
                
                return (
                  <div
                    key={note.id}
                    className={`np__note-card ${isCompleted ? 'np__note-card--completed' : ''}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <label className="np__checkbox-wrapper" title={isCompleted ? 'Mark as pending' : 'Mark as completed'}>
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => handleToggle(note)}
                        className="np__checkbox-input"
                      />
                      <span className="np__checkbox-custom">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </label>

                    <div className="np__note-body">
                      <span className="np__note-title">
                        {note.title}
                      </span>
                    </div>

                    <button
                      className="np__icon-btn"
                      title="Delete note"
                      onClick={() => handleDelete(note.id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
