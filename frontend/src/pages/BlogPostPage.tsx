import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { usePost } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading } = usePost(slug)

  if (isLoading) {
    return (
      <div className="pt-32 pb-20">
        <div className="section-container max-w-3xl animate-pulse space-y-4" aria-busy="true">
          <div className="h-10 bg-line/50 rounded w-2/3" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-line/50 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="pt-32 pb-20">
        <div className="section-container max-w-3xl">
          <h1 className="section-title">Post not found</h1>
          <p className="text-muted mb-8">It may have been unpublished or moved.</p>
          <Link to="/blog" className="btn-primary">
            See all posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-12">
      <article className="section-container max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-muted hover:text-ink text-sm mb-10">
          <ArrowLeft size={14} aria-hidden /> All posts
        </Link>
        <time className="block text-sm text-muted" dateTime={post.created_at}>
          {formatDate(post.created_at)}
        </time>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold leading-tight">{post.title}</h1>
        <p className="mt-4 text-xl text-muted">{post.excerpt}</p>

        {post.cover_image_url && (
          <img src={post.cover_image_url} alt="" className="mt-10 w-full rounded-lg border border-line" />
        )}

        <div className="mt-10 prose prose-lg max-w-none prose-headings:font-display prose-a:text-accent prose-strong:text-ink text-ink prose-p:text-ink prose-li:text-ink prose-code:text-signal prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
