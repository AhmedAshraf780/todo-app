import { useState, useEffect, useCallback } from 'react'
import projectsService, { type Project } from './services/projects'
import './ProjectsPage.css'

// ── Icons ────────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
)
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const FolderIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

// ── Component ────────────────────────────────────────────────────────────────
interface Props {
  onBack: () => void
}

export default function ProjectsPage({ onBack }: Props) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // Create form
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  // Edit state
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [saving, setSaving] = useState(false)

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    try {
      setError(null)
      const data = await projectsService.getAll()
      setProjects(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  // Create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    try {
      const project = await projectsService.create(name.trim(), description.trim())
      setProjects(prev => [...prev, project])
      setName('')
      setDescription('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  // Start editing
  const startEdit = (project: Project) => {
    setEditId(project.id)
    setEditName(project.name)
    setEditDesc(project.description)
    setDeleteId(null)
  }

  // Save edit
  const handleUpdate = async () => {
    if (editId === null || !editName.trim()) return
    setSaving(true)
    try {
      const updated = await projectsService.update(editId, editName.trim(), editDesc.trim())
      setProjects(prev => prev.map(p => p.id === editId ? updated : p))
      setEditId(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await projectsService.delete(id)
      setProjects(prev => prev.filter(p => p.id !== id))
      setDeleteId(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete project')
    }
  }

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pp">
      {/* Background */}
      <div className="pp__bg">
        <div className="pp__orb pp__orb--1" />
        <div className="pp__orb pp__orb--2" />
      </div>

      <div className="pp__inner">
        {/* Top bar */}
        <div className="pp__topbar">
          <button id="projects-back-btn" className="pp__back" onClick={onBack}>
            <BackIcon /> <span>Home</span>
          </button>
          <h1 className="pp__title">Projects</h1>
        </div>

        {/* Error banner */}
        {error && (
          <div className="pp__error" onClick={() => setError(null)}>
            ⚠ {error} <span className="pp__error-close">✕</span>
          </div>
        )}

        <div className="pp__layout">
          {/* ── Left: Create form ── */}
          <aside className="pp__sidebar">
            <div className="pp__card">
              <h2 className="pp__card-title">New Project</h2>
              <form className="pp__form" onSubmit={handleCreate}>
                <div className="pp__field">
                  <label className="pp__label" htmlFor="proj-name">Name</label>
                  <input
                    id="proj-name"
                    className="pp__input"
                    type="text"
                    placeholder="My awesome project"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="pp__field">
                  <label className="pp__label" htmlFor="proj-desc">Description</label>
                  <textarea
                    id="proj-desc"
                    className="pp__input pp__textarea"
                    placeholder="What's this project about?"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <button
                  id="proj-create-btn"
                  className="pp__btn pp__btn--primary"
                  type="submit"
                  disabled={creating || !name.trim()}
                >
                  {creating ? (
                    <span className="pp__spinner" />
                  ) : (
                    <><PlusIcon /> Create Project</>
                  )}
                </button>
              </form>
            </div>
          </aside>

          {/* ── Right: List ── */}
          <section className="pp__main">
            {/* Search */}
            <div className="pp__search-wrap">
              <span className="pp__search-icon"><SearchIcon /></span>
              <input
                id="proj-search"
                className="pp__input pp__search"
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Count */}
            <p className="pp__count">
              {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
              {search && ` matching "${search}"`}
            </p>

            {/* Projects grid */}
            {loading ? (
              <div className="pp__loading">
                <span className="pp__spinner pp__spinner--lg" />
                <span>Loading projects…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="pp__empty">
                <div className="pp__empty-icon"><FolderIcon /></div>
                <p>{search ? 'No projects match your search.' : 'No projects yet. Create your first one!'}</p>
              </div>
            ) : (
              <div className="pp__grid">
                {filtered.map((project, i) => (
                  <div
                    key={project.id}
                    className={`pp__project-card ${editId === project.id ? 'pp__project-card--editing' : ''}`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    {editId === project.id ? (
                      /* ── Edit mode ── */
                      <div className="pp__edit-mode">
                        <input
                          className="pp__input pp__input--inline"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          autoFocus
                          placeholder="Project name"
                        />
                        <textarea
                          className="pp__input pp__textarea pp__input--inline"
                          value={editDesc}
                          onChange={e => setEditDesc(e.target.value)}
                          rows={3}
                          placeholder="Description"
                        />
                        <div className="pp__edit-actions">
                          <button
                            id={`proj-save-${project.id}`}
                            className="pp__btn pp__btn--success pp__btn--sm"
                            onClick={handleUpdate}
                            disabled={saving || !editName.trim()}
                          >
                            {saving ? <span className="pp__spinner" /> : <><CheckIcon /> Save</>}
                          </button>
                          <button
                            id={`proj-cancel-${project.id}`}
                            className="pp__btn pp__btn--ghost pp__btn--sm"
                            onClick={() => setEditId(null)}
                          >
                            <XIcon /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : deleteId === project.id ? (
                      /* ── Delete confirm ── */
                      <div className="pp__delete-confirm">
                        <p className="pp__delete-msg">Delete <strong>{project.name}</strong>?</p>
                        <div className="pp__edit-actions">
                          <button
                            id={`proj-confirm-delete-${project.id}`}
                            className="pp__btn pp__btn--danger pp__btn--sm"
                            onClick={() => handleDelete(project.id)}
                          >
                            <TrashIcon /> Delete
                          </button>
                          <button
                            className="pp__btn pp__btn--ghost pp__btn--sm"
                            onClick={() => setDeleteId(null)}
                          >
                            <XIcon /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── View mode ── */
                      <>
                        <div className="pp__project-accent" />
                        <div className="pp__project-body">
                          <h3 className="pp__project-name">{project.name}</h3>
                          <p className="pp__project-desc">
                            {project.description || <em className="pp__no-desc">No description.</em>}
                          </p>
                        </div>
                        <div className="pp__project-actions">
                          <button
                            id={`proj-edit-${project.id}`}
                            className="pp__icon-btn pp__icon-btn--edit"
                            title="Edit"
                            onClick={() => startEdit(project)}
                          >
                            <EditIcon />
                          </button>
                          <button
                            id={`proj-delete-${project.id}`}
                            className="pp__icon-btn pp__icon-btn--delete"
                            title="Delete"
                            onClick={() => { setDeleteId(project.id); setEditId(null) }}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
