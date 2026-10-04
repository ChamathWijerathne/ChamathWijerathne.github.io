import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PROFILE } from '@/content/profile'

const NAV_LINKS = [
  { to: '/projects', label: 'Projects' },
  { to: '/#experience', label: 'Experience' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => currentTheme())
  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  const toggle = () => {
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* storage unavailable */
    }
    setTheme(next)
  }
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md text-muted hover:text-ink transition-colors"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isActive = (to: string) =>
    to.includes('#') ? location.pathname === '/' && location.hash === to.slice(1) : location.pathname.startsWith(to)

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-colors',
        scrolled || open ? 'bg-paper/90 backdrop-blur border-b border-line' : 'bg-transparent border-b border-transparent'
      )}
    >
      <nav className="section-container flex items-center justify-between h-16" aria-label="Main">
        <Link to="/" className="font-display font-bold text-lg text-ink hover:text-accent transition-colors">
          {PROFILE.name}
        </Link>

        <div className="flex items-center gap-1 md:gap-6">
          <ul className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={cn('nav-link', isActive(to) && 'nav-link-active')}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-muted hover:text-ink"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="md:hidden section-container pb-5 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} onClick={() => setOpen(false)} className={cn('nav-link block py-2 text-lg', isActive(to) && 'nav-link-active')}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
