// Real portfolio content, used until the backend API exists.
// Only facts Anshika provided; anything missing is marked "TODO: add details".
// Every list item has id, order and isVisible (hide an item without deleting it).
// Read this through services/api.js, not directly from components.
import { slugify } from '../utils/slugify.js';

const TODO = 'TODO: add details';

export const profile = {
  firstName: 'Anshika',
  lastName: 'Agarwal',
  tagline: 'Full-Stack Developer that builds with taste.',
  shortBio: 'MCA graduate with a strong foundation in computer science and full-stack web development.',
  longBio:
    'MCA graduate with a strong foundation in computer science and full-stack web development. Experienced in delivering MERN stack training and building database-driven web applications, with hands-on project work using React, Node.js, MongoDB, Firebase, and Django.',
  email: 'anshika222agarwal@gmail.com',
  phone: '+91-8423000227',
  location: 'Kanpur, Uttar Pradesh, India',
  socials: {
    github: 'https://github.com/TODO',
    linkedin: 'https://linkedin.com/in/TODO',
  },
};

export const education = [
  {
    id: 'edu-mca',
    order: 1,
    isVisible: true,
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Jagran Institute of Management, Kanpur',
    endYear: 2026,
    grade: 'CGPA 8.35/10',
  },
  {
    id: 'edu-bca',
    order: 2,
    isVisible: true,
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Chhatrapati Shahu Ji Maharaj University (CSJMU)',
    endYear: 2024,
    grade: 'CGPA 8.13/10',
  },
];

export const experience = [
  {
    id: 'exp-marcadeo',
    order: 1,
    isVisible: true,
    role: 'Software Development Intern',
    company: 'Marcadeo Pvt. Ltd.',
    type: 'internship',
    startDate: 'Aug 2026',
    endDate: null,
    current: true,
    techUsed: ['MERN', 'Django'],
    bulletPoints: [
      'Contributing to full-stack feature development, working across frontend and backend components.',
      'Collaborating with the engineering team on debugging, code reviews, and day-to-day sprint tasks.',
      'Applying MERN/Django skills in a live production environment to build and maintain web application features.',
    ],
  },
  {
    id: 'exp-cloud-education',
    order: 2,
    isVisible: true,
    role: 'MERN Stack Trainer (Intern)',
    company: 'Cloud Education Learning Pvt. Ltd.',
    type: 'internship',
    startDate: 'Feb 2026',
    endDate: 'Apr 2026',
    current: false,
    techUsed: ['React', 'Node.js', 'MongoDB', 'Express'],
    bulletPoints: [
      'Simplified full-stack development concepts for learners through practical, hands-on demonstrations.',
      'Assisted in live projects covering both frontend and backend web development.',
    ],
  },
];

// [name, category, isExpert, label?]. `label` is what the UI shows (defaults to name).
const SKILL_ROWS = [
  ['JavaScript', 'Frontend', true],
  ['React.js', 'Frontend', true],
  ['HTML', 'Frontend', false],
  ['CSS', 'Frontend', false],
  ['Node.js', 'Backend', true],
  ['Django', 'Backend', false],
  ['Java', 'Languages', false],
  ['Python', 'Languages', false, 'Python (basics)'],
  ['C', 'Languages', false],
  ['C++', 'Languages', false],
  ['MongoDB', 'Database', true],
  ['MySQL', 'Database', false],
  ['SQLite', 'Database', false],
  ['Git', 'Tools', false],
  ['GitHub', 'Tools', false],
  ['VS Code', 'Tools', false],
];

export const skills = SKILL_ROWS.map(([name, category, isExpert, label], i) => ({
  id: `skill-${slugify(name === 'C++' ? 'cpp' : name)}`,
  order: i + 1,
  isVisible: true,
  name,
  label: label ?? name,
  category,
  isExpert,
}));


// Adds the fields every project shares: slug, cover path, empty links, year.
function makeProject(order, fields) {
  const slug = slugify(fields.title);
  return {
    id: `project-${slug}`,
    order,
    isVisible: true,
    slug,
    subtitle: '',
    coverImage: `/images/projects/${slug}.jpg`,
    screenshots: [],
    liveLink: '',
    githubLink: '',
    year: 2026,
    ...fields,
  };
}

// Max 6 projects. Case-study fields only restate the facts given above.
export const projects = [
  makeProject(1, {
    title: 'College Grievance Portal',
    subtitle: 'Online Complaint Management System',
    techStack: ['React.js', 'Firebase', 'Firestore', 'Firebase Auth'],
    category: 'Web App',
    featured: true,
    shortDesc: 'A role-based grievance management system for students and administrators.',
    highlights: [
      'Complaint submission, tracking, and status management features.',
      'Firebase Authentication and Firestore for secure access and real-time data management.',
    ],
    problem: TODO,
    approach: 'Firebase Authentication and Firestore for secure access and real-time data management.',
    result: TODO,
  }),
  makeProject(2, {
    title: 'Student Management System',
    techStack: ['Django', 'Python', 'SQLite', 'HTML', 'CSS'],
    category: 'Web App',
    featured: true,
    shortDesc: 'A CRUD-based student management application with frontend and backend integration.',
    highlights: ['Improved server-side processing and overall application stability.'],
    problem: TODO,
    approach: TODO,
    result: 'Improved server-side processing and overall application stability.',
  }),
  makeProject(3, {
    title: 'LumiAnsh',
    subtitle: 'E-Commerce Brand Infrastructure',
    techStack: ['Python', 'Django', 'Web Design'],
    category: 'E-Commerce',
    featured: true,
    shortDesc: 'Digital storefront and branding structure for a handcrafted-goods brand.',
    highlights: ['A responsive, SEO-friendly UI to support brand visibility and user experience.'],
    problem: TODO,
    approach: 'A responsive, SEO-friendly UI to support brand visibility and user experience.',
    result: TODO,
  }),
];

export const sideHustle = [
  {
    id: 'side-lumiansh',
    order: 1,
    isVisible: true,
    name: 'LumiAnsh',
    tagline: 'Handcrafted goods', // TODO: the request was cut off here; confirm the full tagline
    description: TODO,
    relatedProjectSlug: 'lumiansh',
    image: '', // e.g. { src: '/images/side-hustle/lumiansh.jpg', alt: '...', width, height }
    link: '', // brand website URL
    services: [], // ['Service name', ...]
    workSamples: [], // [{ src, alt, caption, width, height }]
    testimonials: [], // [{ quote, name, role }]
  },
];

// ---- Not provided yet: empty lists show "Coming soon." on their pages. ----

// { id, order, isVisible, name, category, why, link, icon }  (icon = image URL, optional)
export const apps = [];

// { id, order, isVisible, title, organisation, role, date, description, category,
//   image: { src, alt, width, height } }   (newest first by `order`)
export const activities = [];

// { id, order, isVisible, title, issuer, date, credentialLink, image }
export const certifications = [];

// { id, order, isVisible, title, issuer, date, description }
export const awards = [];
