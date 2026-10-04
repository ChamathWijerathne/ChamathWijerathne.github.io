import axios from 'axios'

// In development Vite proxies /api to localhost:5000. In production set
// VITE_API_URL (e.g. https://chamath-portfolio-api.onrender.com) at build time.
export const API_URL: string = import.meta.env.VITE_API_URL || ''
export const HAS_API = import.meta.env.DEV || API_URL !== ''

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // Render free tier can take a while to wake up
})

function getToken(): string | null {
  try {
    return localStorage.getItem('admin_token')
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem('admin_token', token)
    else localStorage.removeItem('admin_token')
  } catch {
    /* storage unavailable */
  }
}

export function hasToken() {
  return !!getToken()
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token && config.url?.startsWith('/admin')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Expired admin session → back to login. Public pages are never redirected.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? ''
    if (error.response?.status === 401 && url.startsWith('/admin') && !url.startsWith('/admin/login')) {
      setToken(null)
      window.location.assign('/admin/login')
    }
    return Promise.reject(error)
  }
)

// ── Public endpoints ─────────────────────────────────────────────────────────

export const projectsApi = {
  getAll: () => api.get('/projects'),
  getBySlug: (slug: string) => api.get(`/projects/${slug}`),
}

export const blogApi = {
  getAll: () => api.get('/blog'),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
}

export const skillsApi = {
  getAll: () => api.get('/skills'),
}

export const contactApi = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post('/contact', data),
}

// ── Admin endpoints ───────────────────────────────────────────────────────────

export const adminApi = {
  login: (password: string) => api.post('/admin/login', { password }),
  messages: () => api.get('/admin/messages'),

  projects: {
    create: (data: object) => api.post('/admin/projects', data),
    update: (id: number, data: object) => api.put(`/admin/projects/${id}`, data),
    delete: (id: number) => api.delete(`/admin/projects/${id}`),
  },

  blog: {
    all: () => api.get('/admin/blog/all'),
    create: (data: object) => api.post('/admin/blog', data),
    update: (id: number, data: object) => api.put(`/admin/blog/${id}`, data),
    delete: (id: number) => api.delete(`/admin/blog/${id}`),
  },

  skills: {
    create: (data: object) => api.post('/admin/skills', data),
    update: (id: number, data: object) => api.put(`/admin/skills/${id}`, data),
    delete: (id: number) => api.delete(`/admin/skills/${id}`),
  },
}
