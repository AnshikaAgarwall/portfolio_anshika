// Page shell wrapping every route:
// OfflineBanner → SkipLink → AnnouncementBar → sticky Navbar →
// <main id="main-content"> (the page) → Footer, plus the RouteAnnouncer.
// Suspense sits around <Outlet /> so the shell stays on screen while a lazy
// page chunk loads.
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import SkipLink from '../SkipLink.jsx';
import PageLoader from '../PageLoader.jsx';
import AnnouncementBar from './AnnouncementBar.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import OfflineBanner from './OfflineBanner.jsx';
import RouteAnnouncer from './RouteAnnouncer.jsx';
import { MAIN_CONTENT_ID } from '../../utils/constants.js';

export default function Layout() {
  return (
    <div className="flex min-h-svh flex-col bg-light">
      <SkipLink targetId={MAIN_CONTENT_ID} />
      <OfflineBanner />
      <AnnouncementBar />
      <Navbar />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <RouteAnnouncer />
    </div>
  );
}
