// Fixed copy for /about, /education, /experience and /skills.
// Facts (bio, degrees, roles, skills…) come from services/api.js.
import { RESUME } from './siteConfig.js';

const contactCta = (heading, label = 'Contact') => ({ heading, button: { label, to: '/contact' } });

export const pagesContent = {
  about: {
    seo: {
      title: 'About',
      description: 'About Anshika Agarwal: MCA graduate and full-stack developer based in Kanpur, India.',
    },
    header: { label: 'About', heading: 'About me', intro: 'The person behind the work.' },
    splitLabel: 'About',
    portrait: { src: '/images/placeholders/about-portrait.jpg', alt: 'Portrait of Anshika Agarwal' },
    factsHeading: 'Quick facts',
    facts: {
      location: 'Location',
      email: 'Email',
      current: 'Currently',
      education: 'Education',
    },
    currentRole: (exp) => `${exp.role}, ${exp.company}`,
    buttons: {
      cv: { label: 'Download CV', href: RESUME.href },
      contact: { label: 'Contact', to: '/contact' },
    },
    photoStripHeading: 'Moments', // visually hidden
    // Placeholders: replace src/alt with real photos. Empty list hides the band.
    photoStrip: [
      { src: '/images/placeholders/strip-1.jpg', alt: 'Anshika Agarwal, photo 1' },
      { src: '/images/placeholders/strip-2.jpg', alt: 'Anshika Agarwal, photo 2' },
      { src: '/images/placeholders/strip-3.jpg', alt: 'Anshika Agarwal, photo 3' },
      { src: '/images/placeholders/strip-4.jpg', alt: 'Anshika Agarwal, photo 4' },
    ],
    cta: contactCta("Let's work together"),
  },

  education: {
    seo: {
      title: 'Education',
      description: 'Education of Anshika Agarwal: MCA and BCA degrees.',
    },
    header: { label: 'Education', heading: 'Education', intro: 'Degrees and academic record, newest first.' },
    listLabel: 'Degrees', // visually hidden
    skeletonCount: 2,
    empty: { label: 'Education', title: 'Education coming soon.' },
    cta: contactCta('Want to know more?'),
  },

  experience: {
    seo: {
      title: 'Experience',
      description: 'Experience of Anshika Agarwal: full-stack development and MERN stack training internships.',
    },
    header: { label: 'Experience', heading: 'Experience', intro: 'Internships and professional work, newest first.' },
    listLabel: 'Roles', // visually hidden
    present: 'Present',
    currentBadge: 'Current',
    techLabel: 'Tech used',
    skeletonCount: 2,
    empty: { label: 'Experience', title: 'Experience coming soon.' },
    cta: contactCta("Let's build something"),
  },

  skills: {
    seo: {
      title: 'Skills',
      description: 'Skills of Anshika Agarwal: JavaScript, React.js, Node.js, MongoDB and more.',
    },
    header: { label: 'Skills', heading: 'Skills', intro: 'The languages, frameworks and tools I work with.' },
    expertHeading: 'Expert in',
    otherHeading: 'Also working with',
    empty: { label: 'Skills', title: 'Skills coming soon.' },
    cta: contactCta('Need these skills on your team?', 'Hire me'),
  },

  sideHustle: {
    seo: { title: 'Side hustle', description: 'LumiAnsh: the handcrafted-goods brand run by Anshika Agarwal.' },
    header: { label: 'Side hustle', heading: 'Side hustle', intro: 'What I build outside of client work.' },
    brandLabel: 'Side hustle',
    servicesHeading: 'Services',
    samplesHeading: 'Work samples',
    testimonialsHeading: 'Kind words',
    brandLinkLabel: 'Visit the brand',
    caseStudyLabel: 'Read the case study',
    empty: { label: 'Side hustle', title: 'Coming soon.' },
    cta: contactCta('Have a brand in mind?'),
  },

  apps: {
    seo: { title: 'Apps', description: 'The apps and tools Anshika Agarwal uses every day.' },
    header: { label: 'Apps', heading: 'Apps & tools', intro: 'The software I rely on, and why.' },
    filterLabel: 'Filter apps by category',
    allLabel: 'All',
    queryKey: 'category',
    skeletonCount: 8,
    empty: { label: 'Apps', title: 'Coming soon.' },
    emptyFilter: { label: 'Nothing here', title: 'No apps in this category yet', showAll: 'Show all' },
    cta: contactCta('Curious about my setup?'),
  },

  activities: {
    seo: { title: 'Activities', description: 'Events, volunteering and activities Anshika Agarwal takes part in.' },
    header: { label: 'Activities', heading: 'Activities', intro: 'Events, communities and things I take part in.' },
    galleryHeading: 'Gallery',
    listHeading: 'All activities',
    filterLabel: 'Filter activities by category',
    allLabel: 'All',
    queryKey: 'category',
    skeletonCount: 6,
    empty: { label: 'Activities', title: 'Coming soon.' },
    emptyFilter: { label: 'Nothing here', title: 'No activities in this category yet', showAll: 'Show all' },
    cta: contactCta("Let's meet at the next one"),
  },

  achievements: {
    seo: { title: 'Achievements', description: 'Certifications and awards earned by Anshika Agarwal.' },
    header: { label: 'Achievements', heading: 'Achievements', intro: 'Certifications, awards and milestones.' },
    certificationsHeading: 'Certifications',
    awardsHeading: 'Awards & achievements',
    credentialLabel: 'View credential',
    certificateLabel: (title) => `View certificate: ${title}`,
    skeletonCount: 3,
    empty: { label: 'Achievements', title: 'Coming soon.' },
    cta: contactCta("Let's work together"),
  },

  contact: {
    seo: {
      title: 'Contact', // -> "Contact | Anshika Agarwal"
      description: 'Get in touch with Anshika Agarwal, full-stack developer open to internships and freelance work.',
    },
    header: { label: 'Contact', heading: "Let's talk", intro: 'Open to internships and freelance work.' },
    detailsHeading: 'Contact details',
    rows: { email: 'Email', phone: 'Phone', location: 'Location', linkedin: 'LinkedIn', github: 'GitHub' },
    copy: {
      button: 'Copy',
      copied: 'Email address copied.',
      failed: "Couldn't copy. Please select the address instead.",
    },
    form: {
      name: 'Contact form', // accessible name of the <form>
      heading: 'Send a message',
      fields: {
        name: { label: 'Name' },
        email: { label: 'Email' },
        subject: { label: 'Subject', optional: '(optional)' },
        message: { label: 'Message' },
      },
      counter: (n, max) => `${n} / ${max} characters`,
      submit: 'Send message',
      sending: 'Sending...',
      cooldown: (s) => `Please wait ${s}s`,
      summary: (n) => `Please fix ${n} ${n === 1 ? 'field' : 'fields'} before sending.`,
      errorBox: 'Something went wrong. Please try again or email me directly.',
      toastSuccess: "Message sent. I'll get back to you soon.",
      toastError: "Your message wasn't sent. Please try again.",
      thanks: {
        label: 'Message sent',
        heading: 'Thank you.',
        body: "I've received your message and will reply as soon as I can.",
        again: 'Send another message',
      },
    },
    // Validation messages (shown under each field, prefixed with "Error:").
    errors: {
      nameRequired: 'Please enter your name.',
      nameLength: (min, max) => `Name must be ${min} to ${max} characters.`,
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'Please enter a valid email address, including the @ and the domain.',
      messageRequired: 'Please write a message.',
      messageLength: (min, max) => `Message must be ${min} to ${max} characters.`,
    },
  },
};
