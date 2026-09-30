// "Skip to content" link. Invisible until focused with Tab, then lets
// keyboard and screen-reader users jump past the navigation to <main>.
// Styles live in styles/index.css (.skip-link).
import { UI_TEXT } from '../data/siteConfig.js';
import { MAIN_CONTENT_ID } from '../utils/constants.js';

export default function SkipLink({ targetId = MAIN_CONTENT_ID }) {
  return (
    <a href={`#${targetId}`} className="skip-link">
      {UI_TEXT.skipToContent}
    </a>
  );
}
