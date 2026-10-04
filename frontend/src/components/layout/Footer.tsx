import { Mail } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { PROFILE } from '@/content/profile'

export default function Footer() {
  const links = [
    { icon: FaGithub, href: PROFILE.github, label: 'GitHub' },
    { icon: FaLinkedin, href: PROFILE.linkedin, label: 'LinkedIn' },
    ...(PROFILE.email ? [{ icon: Mail, href: `mailto:${PROFILE.email}`, label: 'Email' }] : []),
  ].filter((l) => l.href)

  return (
    <footer className="border-t border-line mt-24">
      <div className="section-container py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}. {PROFILE.location}.
        </p>
        <div className="flex items-center gap-1">
          {links.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-md hover:text-ink transition-colors"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
