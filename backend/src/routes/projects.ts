import { Router } from 'express'
import { query } from '../db/client'
import { requireAuth } from '../middleware/auth'

const router = Router()

// GET /api/projects — public
router.get('/', async (_req, res) => {
  try {
    const rows = await query(
      'SELECT * FROM projects ORDER BY featured DESC, order_index ASC, created_at DESC'
    )
    res.json({ data: rows })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects' })
  }
})

// GET /api/projects/:slug — public
router.get('/:slug', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM projects WHERE slug = $1', [req.params.slug])
    if (rows.length === 0) { res.status(404).json({ message: 'Not found' }); return }
    res.json({ data: rows[0] })
  } catch {
    res.status(500).json({ message: 'Failed to fetch project' })
  }
})

// POST /api/admin/projects — protected
router.post('/', requireAuth, async (req, res) => {
  const { title, slug, description, long_description, tech_stack, github_url, live_url, image_url, featured, order_index } = req.body
  try {
    const rows = await query(
      `INSERT INTO projects (title, slug, description, long_description, tech_stack, github_url, live_url, image_url, featured, order_index)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title, slug, description, long_description, tech_stack, github_url, live_url, image_url, featured ?? false, order_index ?? 0]
    )
    res.status(201).json({ data: rows[0] })
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project' })
  }
})

// PUT /api/admin/projects/:id — protected
router.put('/:id', requireAuth, async (req, res) => {
  const { title, slug, description, long_description, tech_stack, github_url, live_url, image_url, featured, order_index } = req.body
  try {
    const rows = await query(
      `UPDATE projects SET title=$1, slug=$2, description=$3, long_description=$4, tech_stack=$5,
       github_url=$6, live_url=$7, image_url=$8, featured=$9, order_index=$10
       WHERE id=$11 RETURNING *`,
      [title, slug, description, long_description, tech_stack, github_url, live_url, image_url, featured, order_index, req.params.id]
    )
    if (rows.length === 0) { res.status(404).json({ message: 'Not found' }); return }
    res.json({ data: rows[0] })
  } catch {
    res.status(500).json({ message: 'Failed to update project' })
  }
})

// DELETE /api/admin/projects/:id — protected
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM projects WHERE id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch {
    res.status(500).json({ message: 'Failed to delete project' })
  }
})

export default router
