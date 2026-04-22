import './HomePage.css'

const TodoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)

const NoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const ProjectIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const panes = [
  {
    id: 'todos',
    label: 'Todos',
    description: 'Track tasks and stay productive.',
    icon: <TodoIcon />,
    accent: '#818cf8',
    glow: 'rgba(129,140,248,.35)',
    border: 'rgba(129,140,248,.3)',
    bg: 'rgba(129,140,248,.12)',
  },
  {
    id: 'notes',
    label: 'Notes',
    description: 'Capture ideas and thoughts.',
    icon: <NoteIcon />,
    accent: '#c084fc',
    glow: 'rgba(192,132,252,.35)',
    border: 'rgba(192,132,252,.3)',
    bg: 'rgba(192,132,252,.12)',
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Manage and track your projects.',
    icon: <ProjectIcon />,
    accent: '#34d399',
    glow: 'rgba(52,211,153,.3)',
    border: 'rgba(52,211,153,.3)',
    bg: 'rgba(52,211,153,.1)',
  },
]

interface Props {
  onNavigate: (page: string) => void
}

export default function HomePage({ onNavigate }: Props) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="home">
      {/* Background orbs */}
      <div className="home__bg">
        <div className="home__orb home__orb--1" />
        <div className="home__orb home__orb--2" />
        <div className="home__orb home__orb--3" />
      </div>

      {/* Floating particles */}
      <div className="home__particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--delay': `${(i * 0.4) % 4}s`,
              '--x': `${(i * 37 + 7) % 100}%`,
              '--size': `${2 + (i % 3)}px`,
              '--dur': `${6 + (i % 5)}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Header */}
      <header className="home__header">
        <div className="home__greeting">
          <span className="home__wave">👋</span>
          <span>{greeting}, HIMA,khalex, ASHRAF</span>
        </div>
        <h1 className="home__headline">
          Your workspace,<br />
          <span className="home__headline-accent">all in one place.</span>
        </h1>
        <p className="home__desc">
          Stay on top of your todos, capture your thoughts, and track your projects — beautifully.
        </p>
      </header>

      {/* Navigation panes */}
      <div className="home__panes">
        {panes.map((pane, i) => (
          <button
            key={pane.id}
            id={`nav-${pane.id}`}
            className="nav-pane"
            style={{
              '--accent': pane.accent,
              '--glow': pane.glow,
              '--border': pane.border,
              '--icon-bg': pane.bg,
              '--delay': `${i * 0.1}s`,
            } as React.CSSProperties}
            onClick={() => onNavigate(pane.id)}
          >
            <div className="nav-pane__glow" />
            <div className="nav-pane__icon">{pane.icon}</div>
            <span className="nav-pane__label">{pane.label}</span>
            <span className="nav-pane__desc">{pane.description}</span>
            <span className="nav-pane__arrow">
              <ArrowIcon />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
