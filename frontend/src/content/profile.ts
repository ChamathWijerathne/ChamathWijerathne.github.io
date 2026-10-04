// ─────────────────────────────────────────────────────────────────────────────
// Everything a visitor reads about you lives here. Edit this file to update
// the site — no database needed. Leave a field as '' to hide it.
// ─────────────────────────────────────────────────────────────────────────────

export const PROFILE = {
  name: 'Chamath Wijerathne',
  headline:
    'Twelve years of building production software. Now focused on computer vision and on making models fast enough to ship.',
  location: 'Espoo, Finland',
  availability: 'Open to ML, data and software engineering roles across Finland, on-site, hybrid or remote.',

  // Contact. Empty string hides it everywhere.
  email: 'anuradhika.wije@gmail.com',
  github: 'https://github.com/ChamathWijerathne',
  linkedin: 'https://www.linkedin.com/in/chamathwijerathne',

  // Put your CV at frontend/public/Chamath_Wijerathne_CV.pdf and set this to
  // '/Chamath_Wijerathne_CV.pdf'. Empty string hides the "Download CV" button.
  cvUrl: '',
}

export interface ExperienceItem {
  org: string
  place: string
  role: string
  period?: string
  summary: string
  highlights: string[]
  stack: string[]
}

// Most recent first.
export const EXPERIENCE: ExperienceItem[] = [
  {
    org: 'Fitsec Oy',
    place: 'Espoo, Finland',
    role: 'Full-stack Developer',
    period: 'Jul 2025 – Jul 2026',
    summary:
      'Worked across three concurrent security products: MalwareDNA (malware analysis), BAS (binary analysis) and Forensics.',
    highlights: [
      'Built and maintained backend services, APIs and databases for all three products.',
      'Built data pipelines and D3.js visualisations for MalwareDNA.',
      'Developed and integrated front-end components in JavaScript.',
      'Wrote optimised SQL for MySQL, including replacing N+1 query patterns with UNION ALL queries.',
      'Deployed and maintained the applications on Linux, improving performance and reliability.',
    ],
    stack: ['Python', 'SQL', 'MySQL', 'JavaScript', 'D3.js', 'Linux'],
  },
  {
    org: 'G-SENTRY (Pvt) Ltd',
    place: 'Colombo, Sri Lanka',
    role: 'Senior Software Engineer',
    period: 'Nov 2021 – Dec 2022',
    summary: 'Led development on public sector, healthcare and e-commerce platforms for clients.',
    highlights: [
      'Designed and built a full-stack e-commerce platform end to end with Node.js, Express and React.',
      'Coordinated timelines, reviewed code and mentored junior developers.',
      'Improved code quality and delivery speed through code inspection and Python back-end refactoring.',
      'Delivered end-to-end systems for regional government and international organisations.',
    ],
    stack: ['Node.js', 'Express', 'React', 'Python', 'MySQL'],
  },
  {
    org: 'Government Sector',
    place: 'Colombo, Sri Lanka',
    role: 'Software Engineer',
    period: 'Dec 2016 – Oct 2021',
    summary: 'Back-end and API development for national government digitalisation initiatives.',
    highlights: [
      'Led back-end and API development in Python and Node.js to improve data access between agencies.',
      'Modernised legacy platforms into maintainable full-stack web systems, keeping critical business logic.',
      'Redesigned APIs, restructured databases and upgraded outdated infrastructure.',
      'Replaced decade-old systems with modular software aligned with the national digital strategy.',
    ],
    stack: ['Python', 'Node.js', 'REST APIs', 'Database design'],
  },
  {
    org: 'Virtusa (Pvt) Ltd',
    place: 'Colombo, Sri Lanka',
    role: 'Software Engineer',
    period: 'Oct 2012 – Nov 2016',
    summary: 'Enterprise integration and middleware for international clients. Started as an intern.',
    highlights: [
      'Built and maintained more than 150 API integrations and middleware connectors.',
      'Debugged and resolved critical production issues across distributed environments.',
      'Built back-end and UI components and automated repetitive work with custom scripts.',
    ],
    stack: ['Enterprise integration', 'WSO2', 'APIs', 'Scripting'],
  },
]

export const EDUCATION = [
  {
    title: 'MSc (Tech), Data-Centric Engineering',
    org: 'LUT University, Finland',
    detail:
      'Major in Computer Vision and Pattern Recognition, minor in Software Engineering and Digital Transformation. Sep 2024 – Feb 2027 (expected).',
  },
  {
    title: 'BSc, Computing and Information Systems',
    org: 'Sabaragamuwa University of Sri Lanka',
    detail: 'Sep 2010 – May 2013',
  },
  {
    title: 'AWS Certified Cloud Practitioner',
    org: 'Amazon Web Services',
    detail: 'December 2023',
  },
]

export const SKILL_GROUPS: { label: string; items: string[] }[] = [
  {
    label: 'AI & ML',
    items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'OpenCV', 'CUDA', 'CuPy', 'NumPy', 'pandas', 'Matplotlib', 'OpenAI API', 'Pydantic'],
  },
  { label: 'Programming', items: ['Python', 'JavaScript', 'SQL', 'Java', 'Bash', 'MATLAB', 'Perl'] },
  {
    label: 'Back end & APIs',
    items: ['Node.js', 'Express', 'FastAPI', 'Flask', 'Django', 'REST APIs', 'MySQL', 'Database design'],
  },
  { label: 'Front end', items: ['React', 'D3.js'] },
  { label: 'Platforms & tools', items: ['Linux (Ubuntu, Debian)', 'Docker', 'AWS', 'Git', 'CI/CD'] },
  { label: 'Languages', items: ['English (working proficiency)', 'Sinhala (native)', 'Finnish (beginner)'] },
]
