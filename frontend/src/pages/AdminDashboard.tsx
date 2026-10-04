import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, FolderOpen, Inbox, LogOut, Plus, Trash2, Wrench, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi, projectsApi, setToken, skillsApi } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { type BlogPost, type Project, type Skill } from '@/types'

type Tab = 'projects' | 'blog' | 'skills' | 'messages'

interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

const splitList = (s: string) =>
  s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      {children}
    </label>
  )
}

function ProjectForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient()
  const create = useMutation({
    mutationFn: (data: object) => adminApi.projects.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-projects'] })
      qc.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project added')
      onDone()
    },
    onError: () => toast.error('Project not added. Check the slug is unique.'),
  })
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const title = String(f.get('title'))
    create.mutate({
      title,
      slug: slugify(String(f.get('slug') || title)),
      description: f.get('description'),
      long_description: f.get('long_description') || null,
      tech_stack: splitList(String(f.get('tech_stack'))),
      github_url: f.get('github_url') || null,
      live_url: f.get('live_url') || null,
      featured: f.get('featured') === 'on',
    })
  }
  return (
    <form onSubmit={submit} className="card space-y-4 mb-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title"><input name="title" required className="input-field" /></Field>
        <Field label="Slug (optional)"><input name="slug" className="input-field" /></Field>
      </div>
      <Field label="Short description"><input name="description" required className="input-field" /></Field>
      <Field label="Full write-up (Markdown)"><textarea name="long_description" rows={5} className="input-field" /></Field>
      <Field label="Technologies (comma-separated)"><input name="tech_stack" className="input-field" /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="GitHub URL"><input name="github_url" type="url" className="input-field" /></Field>
        <Field label="Live demo URL"><input name="live_url" type="url" className="input-field" /></Field>
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" name="featured" /> Feature on home page</label>
      <button className="btn-primary" disabled={create.isPending}>{create.isPending ? 'Adding…' : 'Add project'}</button>
    </form>
  )
}

function PostForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient()
  const create = useMutation({
    mutationFn: (data: object) => adminApi.blog.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog'] })
      qc.invalidateQueries({ queryKey: ['blog'] })
      toast.success('Post saved')
      onDone()
    },
    onError: () => toast.error('Post not saved. Check the slug is unique.'),
  })
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const title = String(f.get('title'))
    create.mutate({
      title,
      slug: slugify(String(f.get('slug') || title)),
      excerpt: f.get('excerpt'),
      content: f.get('content'),
      tags: splitList(String(f.get('tags'))),
      published: f.get('published') === 'on',
    })
  }
  return (
    <form onSubmit={submit} className="card space-y-4 mb-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title"><input name="title" required className="input-field" /></Field>
        <Field label="Slug (optional)"><input name="slug" className="input-field" /></Field>
      </div>
      <Field label="Excerpt"><input name="excerpt" required className="input-field" /></Field>
      <Field label="Content (Markdown)"><textarea name="content" required rows={10} className="input-field font-mono text-sm" /></Field>
      <Field label="Tags (comma-separated)"><input name="tags" className="input-field" /></Field>
      <label className="flex items-center gap-2"><input type="checkbox" name="published" /> Publish now</label>
      <button className="btn-primary" disabled={create.isPending}>{create.isPending ? 'Saving…' : 'Save post'}</button>
    </form>
  )
}

function SkillForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient()
  const create = useMutation({
    mutationFn: (data: object) => adminApi.skills.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-skills'] })
      toast.success('Skill added')
      onDone()
    },
    onError: () => toast.error('Skill not added. It may already exist.'),
  })
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    create.mutate({ name: f.get('name'), category: f.get('category'), proficiency: Number(f.get('proficiency')) })
  }
  return (
    <form onSubmit={submit} className="card grid sm:grid-cols-[1fr_1fr_8rem_auto] gap-4 items-end mb-6">
      <Field label="Name"><input name="name" required className="input-field" /></Field>
      <Field label="Category">
        <select name="category" className="input-field">
          {['language', 'framework', 'tool', 'cloud', 'database', 'other'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Level (1–5)"><input name="proficiency" type="number" min={1} max={5} defaultValue={3} className="input-field" /></Field>
      <button className="btn-primary" disabled={create.isPending}>Add</button>
    </form>
  )
}

function Row({ title, meta, onDelete }: { title: string; meta?: string; onDelete: () => void }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3 border-b border-line">
      <div>
        <p className="font-medium">{title}</p>
        {meta && <p className="text-muted text-sm">{meta}</p>}
      </div>
      <button
        onClick={() => {
          if (window.confirm(`Delete "${title}"? This can't be undone.`)) onDelete()
        }}
        className="p-2 text-muted hover:text-danger"
        aria-label={`Delete ${title}`}
      >
        <Trash2 size={16} />
      </button>
    </li>
  )
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('projects')
  const [adding, setAdding] = useState(false)
  const navigate = useNavigate()
  const qc = useQueryClient()

  const logout = () => {
    setToken(null)
    navigate('/admin/login')
  }

  const projects = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => (await projectsApi.getAll()).data.data as Project[],
  })
  const posts = useQuery({
    queryKey: ['admin-blog'],
    queryFn: async () => (await adminApi.blog.all()).data.data as BlogPost[],
  })
  const skills = useQuery({
    queryKey: ['admin-skills'],
    queryFn: async () => (await skillsApi.getAll()).data.data as Skill[],
  })
  const messages = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => (await adminApi.messages()).data.data as Message[],
  })

  const del = (fn: (id: number) => Promise<unknown>, keys: string[]) =>
    async (id: number) => {
      try {
        await fn(id)
        keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }))
        toast.success('Deleted')
      } catch {
        toast.error('Not deleted. Try again.')
      }
    }

  const TABS = [
    { id: 'projects' as Tab, label: 'Projects', icon: FolderOpen, count: projects.data?.length },
    { id: 'blog' as Tab, label: 'Blog', icon: FileText, count: posts.data?.length },
    { id: 'skills' as Tab, label: 'Skills', icon: Wrench, count: skills.data?.length },
    { id: 'messages' as Tab, label: 'Messages', icon: Inbox, count: messages.data?.length },
  ]

  const apiDown = projects.isError && posts.isError

  return (
    <div className="min-h-screen pt-10 pb-20">
      <div className="section-container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Admin</h1>
          <div className="flex gap-3">
            <Link to="/" className="btn-secondary text-sm px-4 py-2">View site</Link>
            <button onClick={logout} className="btn-secondary text-sm px-4 py-2">
              <LogOut size={14} aria-hidden /> Log out
            </button>
          </div>
        </div>

        {apiDown && (
          <p className="card mb-6 text-danger">
            The API isn&apos;t responding. On Render&apos;s free tier it can take up to a minute to wake; reload shortly.
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-8 border-b border-line pb-4" role="tablist">
          {TABS.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => {
                setTab(id)
                setAdding(false)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === id ? 'bg-ink text-paper' : 'text-muted hover:text-ink hover:bg-line/40'
              }`}
            >
              <Icon size={15} aria-hidden /> {label}
              {count !== undefined && <span className="text-xs opacity-70">{count}</span>}
            </button>
          ))}
        </div>

        {tab !== 'messages' && (
          <button onClick={() => setAdding(!adding)} className="btn-primary text-sm px-4 py-2 mb-6">
            {adding ? <><X size={14} aria-hidden /> Cancel</> : <><Plus size={14} aria-hidden /> Add {tab === 'blog' ? 'post' : tab.slice(0, -1)}</>}
          </button>
        )}

        {tab === 'projects' && (
          <>
            {adding && <ProjectForm onDone={() => setAdding(false)} />}
            <ul>
              {projects.data?.map((p) => (
                <Row key={p.id} title={p.title} meta={`${p.featured ? 'Featured. ' : ''}${p.tech_stack.join(', ')}`}
                  onDelete={() => del(adminApi.projects.delete, ['admin-projects', 'projects'])(p.id)} />
              ))}
            </ul>
            {projects.data?.length === 0 && <p className="text-muted">No projects in the database. The site is showing the built-in list.</p>}
          </>
        )}

        {tab === 'blog' && (
          <>
            {adding && <PostForm onDone={() => setAdding(false)} />}
            <ul>
              {posts.data?.map((p) => (
                <Row key={p.id} title={p.title} meta={p.published ? 'Published' : 'Draft'}
                  onDelete={() => del(adminApi.blog.delete, ['admin-blog', 'blog'])(p.id)} />
              ))}
            </ul>
            {posts.data?.length === 0 && <p className="text-muted">No posts yet. Add your first one above.</p>}
          </>
        )}

        {tab === 'skills' && (
          <>
            {adding && <SkillForm onDone={() => setAdding(false)} />}
            <ul>
              {skills.data?.map((s) => (
                <Row key={s.id} title={s.name} meta={`${s.category}, level ${s.proficiency}`}
                  onDelete={() => del(adminApi.skills.delete, ['admin-skills'])(s.id)} />
              ))}
            </ul>
            {skills.data?.length === 0 && <p className="text-muted">No skills in the database.</p>}
          </>
        )}

        {tab === 'messages' && (
          <ul className="space-y-4">
            {messages.data?.map((m) => (
              <li key={m.id} className="card">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-medium">{m.subject}</p>
                  <time className="text-sm text-muted">{new Date(m.created_at).toLocaleString('en-FI')}</time>
                </div>
                <p className="text-sm text-muted mt-1">
                  {m.name}, <a className="link" href={`mailto:${m.email}`}>{m.email}</a>
                </p>
                <p className="mt-3 whitespace-pre-wrap">{m.message}</p>
              </li>
            ))}
            {messages.data?.length === 0 && <p className="text-muted">No messages yet.</p>}
          </ul>
        )}
      </div>
    </div>
  )
}
