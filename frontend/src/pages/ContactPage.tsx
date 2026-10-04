import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, MapPin, Send } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { HAS_API, contactApi } from '@/lib/api'
import { type ContactMessage } from '@/types'
import { PROFILE } from '@/content/profile'

const CAN_SEND = HAS_API || !!PROFILE.email

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessage>()

  const onSubmit = async (data: ContactMessage) => {
    if (!HAS_API) {
      // No API deployed: hand the message to the visitor's email app.
      const body = `${data.message}\n\n— ${data.name} (${data.email})`
      window.location.assign(`mailto:${PROFILE.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`)
      return
    }
    try {
      await contactApi.send(data)
      toast.success('Message sent. Thanks for getting in touch.')
      reset()
    } catch {
      toast.error(
        PROFILE.email
          ? `Message not sent: the server didn't respond. Email ${PROFILE.email} instead.`
          : "Message not sent: the server didn't respond. Message me on LinkedIn instead.",
        { duration: 8000 }
      )
    }
  }

  const fieldError = (msg?: string) => msg && <p className="text-danger text-sm mt-1">{msg}</p>

  return (
    <div className="pt-32 pb-12">
      <div className="section-container">
        <h1 className="section-title sm:text-5xl">Get in touch</h1>
        <p className="section-subtitle">{PROFILE.availability}</p>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12">
          <div>
            <p className="max-w-prose">
              I&apos;m finishing my MSc thesis at LUT University and looking for my next role. If you have an
              opening, or want to talk about computer vision, efficient ML or data systems, send me a message.
            </p>

            <ul className="mt-8 space-y-4">
              {PROFILE.email && (
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-signal shrink-0" aria-hidden />
                  <a href={`mailto:${PROFILE.email}`} className="link">
                    {PROFILE.email}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <FaLinkedin size={18} className="text-signal shrink-0" aria-hidden />
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaGithub size={18} className="text-signal shrink-0" aria-hidden />
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="link">
                  github.com/ChamathWijerathne
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted">
                <MapPin size={18} className="text-signal shrink-0" aria-hidden />
                {PROFILE.location}
              </li>
            </ul>
          </div>

          {CAN_SEND ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 card" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    className="input-field"
                    autoComplete="name"
                    {...register('name', { required: 'Enter your name', maxLength: 120 })}
                  />
                  {fieldError(errors.name?.message)}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input-field"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Enter your email so I can reply',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter an email like name@company.fi' },
                    })}
                  />
                  {fieldError(errors.email?.message)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  className="input-field"
                  placeholder="e.g. ML Engineer role at your company"
                  {...register('subject', { required: 'Add a subject', maxLength: 200 })}
                />
                {fieldError(errors.subject?.message)}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="input-field resize-y"
                  {...register('message', {
                    required: 'Write a message',
                    minLength: { value: 20, message: 'Write at least 20 characters' },
                    maxLength: { value: 5000, message: 'Keep it under 5,000 characters' },
                  })}
                />
                {fieldError(errors.message?.message)}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={16} aria-hidden />
                {isSubmitting ? 'Sending…' : HAS_API ? 'Send message' : 'Open in email app'}
              </button>
            </form>
          ) : (
            <div className="card">
              <p>The fastest way to reach me is a message on LinkedIn.</p>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5">
                <FaLinkedin size={16} aria-hidden /> Message me on LinkedIn
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
