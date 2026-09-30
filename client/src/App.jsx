// Root component: router, motion settings and the route table.
// Every page is lazy-loaded so each route ships as its own JS chunk.
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Layout from './components/layout/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import PageLoader from './components/PageLoader.jsx';
import { ToastProvider } from './components/Toast.jsx';
import { isPageEnabled } from './data/siteConfig.js';

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Education = lazy(() => import('./pages/Education.jsx'));
const Experience = lazy(() => import('./pages/Experience.jsx'));
const Skills = lazy(() => import('./pages/Skills.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Apps = lazy(() => import('./pages/Apps.jsx'));
const SideHustle = lazy(() => import('./pages/SideHustle.jsx'));
const Activities = lazy(() => import('./pages/Activities.jsx'));
const Achievements = lazy(() => import('./pages/Achievements.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Pages switched off in siteConfig (PAGES[].enabled) render the custom 404.
const gate = (key, element) => (isPageEnabled(key) ? element : <NotFound />);

export default function App() {
  return (
    // reducedMotion="user" makes every Framer Motion animation honour
    // the OS-level prefers-reduced-motion setting automatically.
    <MotionConfig reducedMotion="user">
      {/* useToast() works on every page */}
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          {/* Outer Suspense is a safety net; Layout has its own around <Outlet />. */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={gate('about', <About />)} />
                <Route path="education" element={gate('education', <Education />)} />
                <Route path="experience" element={gate('experience', <Experience />)} />
                <Route path="skills" element={gate('skills', <Skills />)} />
                <Route path="projects" element={gate('projects', <Projects />)} />
                <Route path="projects/:slug" element={gate('projects', <ProjectDetail />)} />
                <Route path="apps" element={gate('apps', <Apps />)} />
                <Route path="side-hustle" element={gate('sideHustle', <SideHustle />)} />
                <Route path="activities" element={gate('activities', <Activities />)} />
                <Route path="achievements" element={gate('achievements', <Achievements />)} />
                <Route path="contact" element={gate('contact', <Contact />)} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </MotionConfig>
  );
}
