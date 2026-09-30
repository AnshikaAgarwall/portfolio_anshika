// Single data layer for the whole app. Components call these functions (via
// the useFetch hook), never mockData.js directly.
// Today every getter reads mockData.js; when the backend in ../server is ready,
// swap a getter's body for apiFetch('/api/...') and no component changes.
// All list getters return only visible items, sorted by `order`.
import * as mock from '../data/mockData.js';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
// Optional fake latency so loading skeletons can be seen in dev: VITE_MOCK_DELAY=800
const MOCK_DELAY = Number(import.meta.env.VITE_MOCK_DELAY ?? 0);

// Dev-only switch: add ?fail=1 to any URL to make every mock request fail,
// so error states (ErrorState, error toasts) can be tested.
const shouldFail = () =>
  import.meta.env.DEV && new URLSearchParams(window.location.search).get('fail') === '1';

// Thin fetch wrapper for the real backend. Throws on non-2xx responses.
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return res.status === 204 ? null : res.json();
}

const visibleSorted = (items) =>
  items.filter((item) => item.isVisible).sort((a, b) => a.order - b.order);

// Resolves with a copy (callers can't mutate the source) after `delay` ms,
// or rejects with ApiError(500) when the ?fail=1 dev switch is on.
const mockResponse = (value, delay = MOCK_DELAY) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (shouldFail()) reject(new ApiError('Mock request failed (?fail=1)', 500));
      else resolve(structuredClone(value));
    }, delay),
  );

// Sends the contact form. Mock mode: ~800ms, then { success: true }.
// Real endpoint later (POST `${API_BASE_URL}/messages`):
//   return apiFetch('/messages', { method: 'POST', body: JSON.stringify(formData) });
// eslint-disable-next-line no-unused-vars
export const sendContactMessage = (formData) => mockResponse({ success: true }, 800);

export const getProfile = () => mockResponse(mock.profile);
export const getEducation = () => mockResponse(visibleSorted(mock.education));
export const getExperience = () => mockResponse(visibleSorted(mock.experience));
export const getSkills = () => mockResponse(visibleSorted(mock.skills));
export const getProjects = () => mockResponse(visibleSorted(mock.projects));
export const getFeaturedProjects = () =>
  mockResponse(visibleSorted(mock.projects).filter((p) => p.featured));
export const getSideHustles = () => mockResponse(visibleSorted(mock.sideHustle));
export const getApps = () => mockResponse(visibleSorted(mock.apps));
export const getActivities = () => mockResponse(visibleSorted(mock.activities));
export const getAchievements = () =>
  mockResponse({
    certifications: visibleSorted(mock.certifications),
    awards: visibleSorted(mock.awards),
  });

// Error with an HTTP-style status, so pages can tell "not found" (404)
// apart from other failures.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Rejects with ApiError(404) when no visible project has this slug.
export const getProjectBySlug = (slug) => {
  const project = visibleSorted(mock.projects).find((p) => p.slug === slug);
  return project
    ? mockResponse(project)
    : mockResponse(null).then(() => {
        throw new ApiError(`Project "${slug}" not found`, 404);
      });
};

// Headline numbers for the Home stats strip. Every value is DERIVED from the
// real data above (no invented figures).
export const getStats = () => {
  const projects = visibleSorted(mock.projects);
  const experience = visibleSorted(mock.experience);
  const skills = visibleSorted(mock.skills);
  const mca = visibleSorted(mock.education)[0];

  return mockResponse([
    { id: 'stat-projects', order: 1, icon: 'layers', label: 'Projects built', value: String(projects.length) },
    {
      id: 'stat-internships',
      order: 2,
      icon: 'briefcase',
      label: 'Internships',
      value: String(experience.filter((e) => e.type === 'internship').length),
    },
    { id: 'stat-cgpa', order: 3, icon: 'graduation', label: 'MCA CGPA', value: mca?.grade.replace('CGPA ', '') ?? '' },
    { id: 'stat-skills', order: 4, icon: 'code', label: 'Technologies', value: String(skills.length) },
  ]);
};
