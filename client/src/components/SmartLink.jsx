// Renders a config link object ({ label, href | path, external }) as either a
// router <Link> or an external <a target="_blank"> with a screen-reader hint.
import { Link } from 'react-router-dom';
import { UI_TEXT } from '../data/siteConfig.js';

export default function SmartLink({ link, className, children, ...props }) {
  const content = children ?? link.label;

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {content}
        <span className="sr-only"> {UI_TEXT.newTab}</span>
      </a>
    );
  }

  return (
    <Link to={link.path ?? link.href} className={className} {...props}>
      {content}
    </Link>
  );
}
