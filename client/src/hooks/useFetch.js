// Runs an async loader (usually a function from services/api.js) and tracks
// its state for the UI:
//   const state = useFetch(getProjects);
//   const state = useFetch(() => getProjectBySlug(slug), [slug]);
// state = { status: 'loading' | 'success' | 'error', data, error, retry }.
// Results that arrive after unmount (or after deps change) are ignored.
import { useCallback, useEffect, useState } from 'react';

export default function useFetch(loader, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading', error: null }));

    Promise.resolve()
      .then(loader)
      .then(
        (data) => !cancelled && setState({ status: 'success', data, error: null }),
        (error) => !cancelled && setState({ status: 'error', data: null, error }),
      );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
