// Catches any render error below it (including failed lazy-chunk loads)
// and shows an on-brand error screen with a Reload button instead of a
// blank white page. It sits outside the router, so it only uses plain
// <a>/<button> elements, never <Link>.
import { Component } from 'react';
import Button from './Button.jsx';

// A lazy page chunk failed to download (offline, or a new deploy replaced
// the old files). Reloading fetches the current version.
const CHUNK_ERROR = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk .* failed/i;

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, isChunkError: CHUNK_ERROR.test(error?.message ?? '') };
  }

  componentDidCatch(error, info) {
    // Swap in a real logging service (Sentry etc.) later.
    console.error('Uncaught error:', error, info?.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        role="alert"
        className="flex min-h-svh flex-col items-center justify-center bg-light px-6 text-center text-ink"
      >
        <p className="label mb-8 text-muted">Error</p>
        <h1 className="font-heading text-5xl font-semibold uppercase leading-none tracking-display md:text-7xl">
          Something
          <br />
          went wrong.
        </h1>
        <span className="my-8 block h-px w-16 bg-ink" aria-hidden="true" />
        <p className="mb-10 max-w-sm font-body text-sm leading-relaxed text-muted">
          {this.state.isChunkError
            ? "This page couldn't load. Check your connection, then reload to get the latest version."
            : 'JUST LIKE ME , THIS IS ALSO BROKEN .'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <Button onClick={this.handleReload}>Reload</Button>
          <Button as="a" href="/" variant="link">
            Go home
          </Button>
        </div>
      </main>
    );
  }
}
