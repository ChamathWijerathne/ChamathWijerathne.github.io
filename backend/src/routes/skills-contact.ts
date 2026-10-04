import { Router } from 'express'
import { query } from '../db/client'
import { requireAuth } from '../middleware/auth'

export const skillsRouter = Router()

skillsRouter.get('/', async (_req, res) => {
  try {
    const rows = await query('SELECT * FROM skills ORDER BY category, name')
    res.json({ data: rows })
  } catch {
    res.status(500).json({ message: 'Failed to fetch skills' })
  }
})

skillsRouter.post('/', requireAuth, async (req, res) => {
  const { name, category, proficiency, icon_url } = req.body
  try {
    const rows = await query(
      'INSERT INTO skills (name, category, proficiency, icon_url) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, category, proficiency ?? 3, icon_url]
    )
    res.status(201).json({ data: rows[0] })
  } catch {
    res.status(500).json({ message: 'Failed to create skill' })
  }
})

skillsRouter.put('/:id', requireAuth, async (req, res) => {
  const { name, category, proficiency, icon_url } = req.body
  try {
    const rows = await query(
      'UPDATE skills SET name=$1, category=$2, proficiency=$3, icon_url=$4 WHERE id=$5 RETURNING *',
      [name, category, proficiency ?? 3, icon_url, req.params.id]
    )
    if (rows.length === 0) { res.status(404).json({ message: 'Not found' }); return }
    res.json({ data: rows[0] })
  } catch {
    res.status(500).json({ message: 'Failed to update skill' })
  }
})

skillsRouter.delete('/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM skills WHERE id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch {
    res.status(500).json({ message: 'Failed to delete skill' })
  }
})

// ── Contact ──────────────────────────────────────────────────────────────────

export const contactRouter = Router()

contactRouter.post('/', async (req, res) => {
  const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const name = clean(req.body?.name)
  const email = clean(req.body?.email)
  const subject = clean(req.body?.subject)
  const message = clean(req.body?.message)

  if (!name || !email || !subject || !message) {
    res.status(400).json({ message: 'All fields are required' })
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    res.status(400).json({ message: 'Email address is not valid' })
    return
  }
  if (name.length > 120 || subject.length > 200 || message.length > 5000) {
    res.status(400).json({ message: 'Message is too long' })
    return
  }
  try {
    await query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1,$2,$3,$4)',
      [name, email, subject, message]
    )
    res.json({ message: 'Message received' })
  } catch {
    res.status(500).json({ message: 'Failed to save message' })
  }
})
