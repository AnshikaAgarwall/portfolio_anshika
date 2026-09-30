// Slim black bar at the very top while the device is offline.
// The role="status" region is always in the DOM (empty when online) so screen
// readers reliably announce the message when the connection drops.
import useOnlineStatus from '../../hooks/useOnlineStatus.js';
import { UI_TEXT } from '../../data/siteConfig.js';

export default function OfflineBanner() {
  const online = useOnlineStatus();

  return (
    <div role="status" aria-live="polite">
      {!online && (
        <p className="surface-dark border-b border-paper/20 bg-ink px-6 py-2 text-center text-micro font-medium uppercase tracking-wide2 text-paper">
          {UI_TEXT.offline}
        </p>
      )}
    </div>
  );
}
