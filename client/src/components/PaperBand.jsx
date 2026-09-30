// Padded off-white band. Used as DataBoundary's `wrapper` so loading, empty
// and error states sit in a proper band on multi-band pages.
import Band from './Band.jsx';

export default function PaperBand({ children }) {
  return (
    <Band tone="paper" innerClassName="py-16 md:py-24">
      {children}
    </Band>
  );
}
