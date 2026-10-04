import { type Project } from '@/types'

// Projects shown when the API is unavailable or empty. Projects added through
// the admin dashboard replace this list once the backend is live.
const p = (x: Omit<Project, 'id' | 'created_at' | 'order_index'>, i: number): Project => ({
  id: -(i + 1),
  created_at: '2026-01-01T00:00:00Z',
  order_index: i,
  ...x,
})

export const STATIC_PROJECTS: Project[] = [
  {
    title: 'GPU-accelerated ML: kNN and MLP benchmarking',
    slug: 'cuda-knn-mlp',
    description:
      'End-to-end ML pipelines benchmarked on CPU and GPU. A custom CUDA kernel made kNN inference 20× faster; a tuned PyTorch MLP trained 3× faster with 10× faster inference.',
    long_description: `Machine learning pipelines built and benchmarked on both CPU and GPU, from data preprocessing to model evaluation (2025).

- **Custom CUDA kernel for kNN inference: 20× speedup** over the CPU baseline
- **PyTorch MLP** with dropout and batch normalisation, optimised for **3× faster training** and **10× faster inference**
- Execution benchmarks and visualisations produced for the technical report

The same focus on inference cost carries into my MSc work on model compression, and applies directly to real-time sensor data processing.`,
    tech_stack: ['Python', 'CUDA', 'CuPy', 'PyTorch', 'NumPy'],
    featured: true,
  },
  {
    title: 'Micro-gesture recognition with deep learning',
    slug: 'gesture-recognition',
    description:
      'Classifies 32 subtle hand micro-gestures from RGB video without skeleton or keypoint data. ResNet18 features and video-level voting reach 86.5% accuracy.',
    long_description: `A deep learning pipeline that recognises **32 micro-gestures** from RGB video frames, focusing on subtle hand motion and using **no skeleton or keypoint data** (2025).

- Frames resized and normalised, then visual features extracted with a pretrained **ResNet18**
- Frame-level predictions combined by **video-level majority voting** for temporal consistency
- **86.5% video-level accuracy**, with consistent convergence over 10 training epochs`,
    tech_stack: ['Python', 'PyTorch', 'ResNet18', 'OpenCV', 'torchvision'],
    featured: true,
  },
  {
    title: 'Daily electric power consumption forecast',
    slug: 'power-consumption-forecast',
    description:
      'Group time-series project on the UCI household power dataset: EDA, STL decomposition, autocorrelation and forecasting.',
    long_description: `A group time-series project on the UCI household electric power consumption dataset.

- Exploratory analysis of daily consumption patterns
- STL decomposition into trend, seasonality and residual
- Autocorrelation analysis to choose model structure
- Forecasting daily consumption and evaluating the models`,
    tech_stack: ['Python', 'Time-series', 'Forecasting', 'EDA'],
    github_url: 'https://github.com/ChamathWijerathne/Forecast-Of-The-Daily-Electric-Power-Consumption',
    featured: true,
  },
  {
    title: 'Advanced data analysis and ML',
    slug: 'advanced-data-analysis-ml',
    description: 'Coursework on dimensionality reduction and unsupervised learning: PCA vs t-SNE and self-organising maps on MNIST.',
    long_description: `Coursework from LUT's Advanced Data Analysis and Machine Learning course.

- PCA compared with t-SNE for visualising high-dimensional data
- Self-organising maps trained on MNIST
- Other dimensionality-reduction techniques and how to read their output`,
    tech_stack: ['Python', 'scikit-learn', 'PCA', 't-SNE', 'SOM'],
    github_url: 'https://github.com/ChamathWijerathne/Advanced-Data-Analysis-and-Machine-Learning',
    featured: false,
  },
  {
    title: 'quantum-sdk',
    slug: 'quantum-sdk',
    description: 'A Python SDK built from scratch to practise modern packaging: uv, src layout, pytest and GitLab CI/CD.',
    long_description: `A practice SDK built from scratch with a modern Python toolchain:

- \`uv\` for dependencies and environments
- \`src/\` package layout
- \`pytest\` test suite
- GitLab CI/CD pipeline running tests on every push`,
    tech_stack: ['Python', 'uv', 'pytest', 'GitLab CI'],
    featured: false,
  },
  {
    title: 'This portfolio',
    slug: 'portfolio',
    description: 'React front end on GitHub Pages, with an Express and PostgreSQL API for the blog and admin.',
    long_description: `The site you're on.

- **Front end:** React, Vite and Tailwind, deployed to GitHub Pages by GitHub Actions
- **API:** Node.js and Express with PostgreSQL on Neon, hosted on Render
- An admin dashboard behind JWT auth for projects, posts and skills
- Works without the API too: content falls back to static data`,
    tech_stack: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    github_url: 'https://github.com/ChamathWijerathne/ChamathWijerathne.github.io',
    featured: false,
  },
].map(p)

// ── Card styling used by ProjectGrid.tsx (the dark design). Not used by the
// current design; safe to delete together with ProjectGrid.tsx. ──────────────
export type ProjectIcon = 'cpu' | 'hand' | 'shield' | 'activity' | 'scatter' | 'package' | 'code' | 'folder'

export interface ProjectMeta {
  icon: ProjectIcon
  hue: number
  category: 'ML & vision' | 'Data' | 'Software'
  context: string
}

export const DEFAULT_META: ProjectMeta = { icon: 'folder', hue: 235, category: 'Software', context: 'Project' }
export function metaFor(slug: string): ProjectMeta {
  void slug
  return DEFAULT_META
}
