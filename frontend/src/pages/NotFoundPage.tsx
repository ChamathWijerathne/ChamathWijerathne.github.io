import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="pt-40 pb-20">
      <div className="section-container max-w-3xl">
        <p className="font-display font-bold text-8xl text-signal">404</p>
        <h1 className="mt-4 text-3xl font-bold">This page doesn&apos;t exist</h1>
        <p className="mt-3 text-muted">The link may be old, or the page has moved.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="btn-primary">
            Go to the home page
          </Link>
          <Link to="/projects" className="btn-secondary">
            See projects
          </Link>
        </div>
      </div>
    </div>
  )
}
