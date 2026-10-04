import { Router } from 'express'
import { query } from '../db/client'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const rows = await query(
      'SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC'
    )
    res.json({ data: rows })
  } catch {
    res.status(500).json({ message: 'Failed to fetch posts' })
  }
})

// GET /api/admin/blog/all — every post including drafts (admin only)
router.get('/all', requireAuth, async (_req, res) => {
  try {
    res.json({ data: await query('SELECT * FROM blog_posts ORDER BY created_at DESC') })
  } catch {
    res.status(500).json({ message: 'Failed to fetch posts' })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const rows = await query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND published = true', [req.params.slug]
    )
    if (rows.length === 0) { res.status(404).json({ message: 'Not found' }); return }
    res.json({ data: rows[0] })
  } catch {
    res.status(500).json({ message: 'Failed to fetch post' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  const { title, slug, excerpt, content, tags, published, cover_image_url } = req.body
  try {
    const rows = await query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, tags, published, cover_image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, slug, excerpt, content, tags, published ?? false, cover_image_url]
    )
    res.status(201).json({ data: rows[0] })
  } catch {
    res.status(500).json({ message: 'Failed to create post' })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  const { title, slug, excerpt, content, tags, published, cover_image_url } = req.body
  try {
    const rows = await query(
      `UPDATE blog_posts SET title=$1, slug=$2, excerpt=$3, content=$4, tags=$5,
       published=$6, cover_image_url=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [title, slug, excerpt, content, tags, published, cover_image_url, req.params.id]
    )
    if (rows.length === 0) { res.status(404).json({ message: 'Not found' }); return }
    res.json({ data: rows[0] })
  } catch {
    res.status(500).json({ message: 'Failed to update post' })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM blog_posts WHERE id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch {
    res.status(500).json({ message: 'Failed to delete post' })
  }
})

export default router
