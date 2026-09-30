// Fixed copy, links and image paths for the Home bands below the Hero.
// Anything that comes from real data (grades, roles, counts, bio, email) is
// fetched through services/api.js; the `describe` functions only format it.

// "Master of Computer Applications (MCA)" -> "MCA"
const abbreviation = (degree) => degree.match(/\(([^)]+)\)/)?.[1] ?? degree;

export const homeContent = {
  quickLinks: {
    heading: 'Explore', // visually hidden, for screen readers
    cards: [
      {
        key: 'education',
        title: 'Education',
        to: '/education',
        linkLabel: 'View education',
        image: '/images/placeholders/education.jpg',
        describe: ({ education }) => {
          const latest = education[0];
          return latest ? `${abbreviation(latest.degree)} · ${latest.grade}` : '';
        },
      },
      {
        key: 'experience',
        title: 'Experience',
        to: '/experience',
        linkLabel: 'View experience',
        image: '/images/placeholders/experience.jpg',
        describe: ({ experience }) => {
          const role = experience.find((e) => e.current) ?? experience[0];
          return role ? `${role.role} at ${role.company}` : '';
        },
      },
      {
        key: 'projects',
        title: 'Projects',
        to: '/projects',
        linkLabel: 'View projects',
        image: '/images/placeholders/projects.jpg',
        describe: ({ projects }) => `${projects.length} ${projects.length === 1 ? 'project' : 'projects'} built`,
      },
    ],
  },

  story: {
    label: 'Currently',
    heading: 'Building with the MERN stack',
    cta: { label: 'About me', to: '/about' },
    image: { src: '/images/placeholders/story.jpg', alt: '' }, // decorative placeholder
  },

  stats: {
    heading: 'At a glance', // visually hidden
  },

  featured: {
    heading: 'Selected work',
    viewAll: { label: 'View all', to: '/projects' },
    skeletonCount: 4,
    empty: { label: 'Selected work', title: 'Projects coming soon', message: 'New case studies are on the way.' },
  },

  contact: {
    label: 'Get in touch',
    heading: "Let's talk",
    copyButton: 'Copy email',
    copied: 'Email address copied.',
    copyFailed: "Couldn't copy. Please select the address instead.",
    contactButton: { label: 'Contact', to: '/contact' },
  },
};
