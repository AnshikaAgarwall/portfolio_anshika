// Black closing band used at the bottom of inner pages: big heading and a
// light button (usually to /contact).
import { Link } from 'react-router-dom';
import Band from './Band.jsx';
import Button from './Button.jsx';

export default function CtaBand({ heading, button }) {
  return (
    <Band
      tone="dark"
      aria-labelledby="cta-heading"
      innerClassName="flex flex-col items-start gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-28"
    >
      <h2
        id="cta-heading"
        className="max-w-4xl font-heading text-[clamp(2.5rem,8vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-display"
      >
        {heading}
      </h2>
      <Button as={Link} to={button.to} variant="inverse" className="shrink-0">
        {button.label}
      </Button>
    </Band>
  );
}
