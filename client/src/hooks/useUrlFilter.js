// Keeps one filter value in the URL query (?category=Web%20App) so filtered
// views can be shared and the Back button steps through filters.
//   const [active, setActive] = useUrlFilter('category');   // '' = All
import { useSearchParams } from 'react-router-dom';

export default function useUrlFilter(key, allValue = '') {
  const [params, setParams] = useSearchParams();
  const active = params.get(key) ?? allValue;

  const setActive = (value) => {
    const next = new URLSearchParams(params);
    if (value === allValue) next.delete(key);
    else next.set(key, value);
    setParams(next); // pushes a history entry
  };

  return [active, setActive];
}
