// Thin black strip at the very top of the page (like "FREE DELIVERY..." in
// the reference). Availability text on the left; Resume | LinkedIn | GitHub on
// the right, which is hidden on mobile.
import { Fragment } from 'react';
import SmartLink from '../SmartLink.jsx';
import { SITE, ANNOUNCEMENT_LINKS } from '../../data/siteConfig.js';

export default function AnnouncementBar() {
  return (
    <div className="surface-dark bg-ink text-paper">
      <div className="mx-auto flex h-8 max-w-screen-2xl items-center justify-center px-6 md:justify-between md:px-10">
        <p className="text-micro font-medium uppercase tracking-wide2">{SITE.availability}</p>

        <ul className="hidden items-center md:flex">
          {ANNOUNCEMENT_LINKS.map((link, i) => (
            <Fragment key={link.label}>
              {i > 0 && <li aria-hidden="true" className="mx-4 h-3 w-px bg-paper/40" />}
              <li>
                <SmartLink
                  link={link}
                  className="text-micro font-medium uppercase tracking-wide2 transition-opacity duration-200 hover:opacity-60"
                />
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}
