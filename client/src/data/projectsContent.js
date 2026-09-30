// Fixed copy for /projects and /projects/:slug. Project data itself comes
// from services/api.js.
export const projectsContent = {
  list: {
    seo: {
      title: 'Projects',
      description: 'Selected full-stack projects by Anshika Agarwal: React, Node.js, Django and Firebase web apps.',
    },
    label: 'Work',
    heading: 'Selected projects',
    intro: 'Full-stack web applications, from idea to database to interface.',
    count: (n) => `${String(n).padStart(2, '0')} ${n === 1 ? 'project' : 'projects'}`,
    gridHeading: 'All projects', // visually hidden
    filterLabel: 'Filter projects by category',
    allLabel: 'All',
    queryKey: 'category', // /projects?category=Web%20App
    skeletonCount: 6,
    empty: {
      label: 'Nothing here',
      title: 'No projects in this category yet',
      showAll: 'Show all',
    },
    noProjects: {
      label: 'Work',
      title: 'Projects coming soon',
      message: 'New case studies are on the way.',
    },
    cta: {
      heading: 'Have an idea?',
      button: { label: 'Hire me', to: '/contact' },
    },
  },

  detail: {
    backLink: { label: 'Back to all projects', to: '/projects' },
    liveLabel: 'Live demo',
    githubLabel: 'GitHub',
    yearLabel: 'Year',
    // Case-study sections in display order. `field` is the project property.
    sections: [
      { id: 'overview', label: 'Overview', field: 'shortDesc', type: 'text' },
      { id: 'problem', label: 'Problem', field: 'problem', type: 'text' },
      { id: 'approach', label: 'Approach', field: 'approach', type: 'text' },
      { id: 'result', label: 'Result', field: 'result', type: 'text' },
      { id: 'features', label: 'Key features', field: 'highlights', type: 'list' },
      { id: 'stack', label: 'Tech stack', field: 'techStack', type: 'tags' },
    ],
    galleryLabel: 'Screenshots',
    screenshotAlt: (title, n) => `${title} screenshot ${n}`,
    prevLabel: 'Previous project',
    nextLabel: 'Next project',
  },
};
