export interface Project {
  id: number
  title: string
  slug: string
  description: string
  long_description?: string
  tech_stack: string[]
  github_url?: string
  live_url?: string
  image_url?: string
  featured: boolean
  order_index: number
  created_at: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  published: boolean
  cover_image_url?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: number
  name: string
  category: 'language' | 'framework' | 'tool' | 'cloud' | 'database' | 'other'
  proficiency: 1 | 2 | 3 | 4 | 5
  icon_url?: string
}

export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  status: number
}

export interface AdminLoginPayload {
  password: string
}

export interface AuthToken {
  token: string
}
