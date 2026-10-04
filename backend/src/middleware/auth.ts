import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid token' })
    return
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    res.status(500).json({ message: 'Server auth is not configured' })
    return
  }

  const token = authHeader.slice(7)
  try {
    jwt.verify(token, secret)
    next()
  } catch {
    res.status(401).json({ message: 'Token expired or invalid' })
  }
}
