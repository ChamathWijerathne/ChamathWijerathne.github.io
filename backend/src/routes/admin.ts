import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { timingSafeEqual } from 'crypto'
import jwt from 'jsonwebtoken'
import { requireAuth } from '../middleware/auth'
import { query } from '../db/client'

const router = Router()

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { password } = req.body ?? {}
  if (typeof password !== 'string' || !password) {
    res.status(400).json({ message: 'Password required' })
    return
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  const secret = process.env.JWT_SECRET
  if (!adminPassword || !secret) {
    res.status(500).json({ message: 'Admin login is not configured' })
    return
  }

  // ADMIN_PASSWORD may be a bcrypt hash (recommended) or plain text (local dev).
  let match: boolean
  if (/^\$2[aby]\$/.test(adminPassword)) {
    match = await bcrypt.compare(password, adminPassword)
  } else {
    const a = Buffer.from(password)
    const b = Buffer.from(adminPassword)
    match = a.length === b.length && timingSafeEqual(a, b)
  }

  if (!match) {
    res.status(401).json({ message: 'Invalid password' })
    return
  }

  const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '7d' })
  res.json({ data: { token } })
})

// GET /api/admin/verify — check token validity
router.get('/verify', requireAuth, (_req, res) => {
  res.json({ valid: true })
})

// GET /api/admin/messages — contact messages inbox
router.get('/messages', requireAuth, async (_req, res) => {
  try {
    const rows = await query('SELECT * FROM contact_messages ORDER BY created_at DESC')
    res.json({ data: rows })
  } catch {
    res.status(500).json({ message: 'Failed to fetch messages' })
  }
})

export default router
