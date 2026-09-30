// Accessible filter tabs (WAI-ARIA tabs pattern): role="tablist", one
// tab stop, ←/→ to move (wraps), Home/End for first/last. Moving also
// selects (automatic activation). Active tab gets a thin underline.
// Scrolls sideways inside itself on narrow screens (never the page).
//   <FilterTabs options={[{ value, label }]} active={value} onChange={fn}
//               label="Filter projects" panelId="projects-panel" />
import { useRef } from 'react';
import { cn } from '../utils/cn.js';
import { slugify } from '../utils/slugify.js';

export const tabId = (value) => `tab-${slugify(value) || 'all'}`;

export default function FilterTabs({ options, active, onChange, label, panelId }) {
  const tabRefs = useRef([]);
  const activeIndex = options.findIndex((o) => o.value === active);
  // If the URL holds an unknown value, keep the first tab reachable by Tab.
  const focusIndex = activeIndex === -1 ? 0 : activeIndex;

  const onKeyDown = (event, index) => {
    const last = options.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;

    event.preventDefault();
    tabRefs.current[next]?.focus();
    onChange(options[next].value);
  };

  return (
    <div role="tablist" aria-label={label} className="-mx-6 flex gap-8 overflow-x-auto px-6 md:mx-0 md:px-0">
      {options.map((option, i) => {
        const selected = option.value === active;
        return (
          <button
            key={option.value || 'all'}
            ref={(el) => (tabRefs.current[i] = el)}
            type="button"
            role="tab"
            id={tabId(option.value)}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={i === focusIndex ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'min-h-11 shrink-0 whitespace-nowrap border-b text-label font-medium uppercase tracking-wide2 transition-colors duration-300',
              selected ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
