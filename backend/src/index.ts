import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import projectsRouter from './routes/projects'
import blogRouter from './routes/blog'
import { skillsRouter, contactRouter } from './routes/skills-contact'
import adminRouter from './routes/admin'

dotenv.config()

const app = express()
// Render sits behind a proxy; needed so rate limits apply per visitor, not per proxy.
app.set('trust proxy', 1)
const PORT = parseInt(process.env.PORT ?? '5000', 10)

// ── Security middleware ───────────────────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: [
      ...(process.env.FRONTEND_URL ?? 'http://localhost:3000').split(',').map((s) => s.trim()),
      'https://chamathwijerathne.github.io',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
)

// General rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
)

// Strict limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many messages, please wait an hour.' },
})

// Brute-force protection for the admin password
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many sign-in attempts. Try again in 15 minutes.' },
})

app.use(express.json({ limit: '500kb' }))
app.use(express.urlencoded({ extended: true }))

// ── Routes ───────────────────────────────────────────────────────────────────

// Public
app.use('/api/projects', projectsRouter)
app.use('/api/blog', blogRouter)
app.use('/api/skills', skillsRouter)
app.use('/api/contact', contactLimiter, contactRouter)

// Admin auth
app.use('/api/admin/login', loginLimiter)
app.use('/api/admin', adminRouter)

// Admin CRUD (all protected via requireAuth in the route files)
app.use('/api/admin/projects', projectsRouter)
app.use('/api/admin/blog', blogRouter)
app.use('/api/admin/skills', skillsRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() })
})

// 404
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Malformed JSON and any unhandled error → JSON response, never an HTML stack trace
app.use((err: Error & { status?: number; type?: string }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Request body is not valid JSON' })
    return
  }
  console.error(err)
  res.status(err.status ?? 500).json({ message: 'Something went wrong' })
})

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
})

export default app
