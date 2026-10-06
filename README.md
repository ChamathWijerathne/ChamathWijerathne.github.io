# chamathwijerathne.github.io

Personal portfolio of Chamath Wijerathne: software engineer (12+ years), MSc Data-Centric Engineering at LUT University, Espoo, Finland.

Live site: https://chamath.is-a.dev

## Stack

| Part | Tech | Hosting |
| --- | --- | --- |
| `frontend/` | React 19, TypeScript, Vite, Tailwind, TanStack Query | GitHub Pages (GitHub Actions) |
| `backend/` | Node.js, Express 5, PostgreSQL | Render (API), Neon (database) |

The front end works **without** the API: projects, experience and skills come from
`frontend/src/content/`, and the API only adds the blog, contact inbox and admin dashboard.

## Edit your content

- `frontend/src/content/profile.ts` — headline, email, LinkedIn, CV link, experience, education, skills
- `frontend/src/content/projects.ts` — project list and write-ups (Markdown)
- CV: put the PDF at `frontend/public/Chamath_Wijerathne_CV.pdf` and set `cvUrl: '/Chamath_Wijerathne_CV.pdf'`

## Run locally

```bash
npm run install:all
cp backend/.env.example backend/.env   # fill in DATABASE_URL etc.
npm run db:migrate --prefix backend    # first time only
npm run dev                            # front end :3000, API :5000
```

## Deploy

**Front end:** every push to `main` that touches `frontend/` builds and deploys via
`.github/workflows/deploy.yml`. One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

**API:** Render reads `render.yaml`. Set `DATABASE_URL` and `ADMIN_PASSWORD` (preferably a bcrypt hash) in
the Render dashboard. Once it's live, add a repo variable `VITE_API_URL` (Settings → Secrets and variables →
Actions → Variables) with the Render URL and re-run the deploy workflow. That turns on the blog,
the contact form and `/admin`.
