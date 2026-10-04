// Data access with graceful fallback: the site must read well even when the
// API is asleep, unreachable or not deployed yet.
import { useQuery } from '@tanstack/react-query'
import { HAS_API, blogApi, projectsApi } from './api'
import { STATIC_PROJECTS } from '@/content/projects'
import { type BlogPost, type Project } from '@/types'

async function fetchProjects(): Promise<Project[]> {
  if (!HAS_API) return STATIC_PROJECTS
  try {
    const res = await projectsApi.getAll()
    const rows = res.data?.data
    return Array.isArray(rows) && rows.length > 0 ? (rows as Project[]) : STATIC_PROJECTS
  } catch {
    return STATIC_PROJECTS
  }
}

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
}

export function useProject(slug: string | undefined) {
  const { data, isLoading } = useProjects()
  return { project: data?.find((p) => p.slug === slug), isLoading }
}

async function fetchPosts(): Promise<BlogPost[]> {
  if (!HAS_API) return []
  try {
    const res = await blogApi.getAll()
    const rows = res.data?.data
    return Array.isArray(rows) ? (rows as BlogPost[]) : []
  } catch {
    return []
  }
}

export function usePosts() {
  return useQuery({ queryKey: ['blog'], queryFn: fetchPosts })
}

async function fetchPost(slug: string): Promise<BlogPost | null> {
  if (!HAS_API) return null
  try {
    const res = await blogApi.getBySlug(slug)
    return (res.data?.data as BlogPost) ?? null
  } catch {
    return null
  }
}

export function usePost(slug: string | undefined) {
  return useQuery({ queryKey: ['blog', slug], queryFn: () => fetchPost(slug!), enabled: !!slug })
}
