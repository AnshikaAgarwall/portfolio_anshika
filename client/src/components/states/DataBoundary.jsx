// Renders the right UI state for a useFetch() result, so sections never
// repeat the same if/else:
//   <DataBoundary state={state} skeleton={<MySkeleton />} tone="dark">
//     {(data) => <Content data={data} />}
//   </DataBoundary>
// - skeleton: custom placeholder (same size as the content, so nothing jumps);
//   otherwise a generic LoadingState built from `loading` props.
// - empty = null or [] by default; override with `isEmpty`.
// - tone="dark" restyles the default states for black bands.
// - wrapper: optional component placed around the loading/empty/error states
//   (e.g. a Band) for pages whose content renders several bands itself.
import LoadingState from './LoadingState.jsx';
import EmptyState from './EmptyState.jsx';
import ErrorState from './ErrorState.jsx';

const defaultIsEmpty = (data) => data == null || (Array.isArray(data) && data.length === 0);

export default function DataBoundary({
  state,
  children,
  skeleton,
  loading,
  empty,
  error,
  tone = 'light',
  isEmpty = defaultIsEmpty,
  wrapper: Wrapper,
}) {
  const wrap = (node) => (Wrapper ? <Wrapper>{node}</Wrapper> : node);

  if (state.status === 'loading') {
    return wrap(skeleton ?? <LoadingState tone={tone} {...loading} />);
  }
  if (state.status === 'error') {
    return wrap(<ErrorState tone={tone} onRetry={state.retry} {...error} />);
  }
  if (isEmpty(state.data)) {
    return wrap(<EmptyState tone={tone} {...empty} />);
  }
  return children(state.data);
}
