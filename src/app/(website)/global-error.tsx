"use client";

/**
 * Global error boundary (Next.js `global-error.tsx`). Wraps the whole app
 * and renders its own <html>/<body>, so it must be fully self-contained.
 * Used as a last resort when the root layout itself throws.
 */
export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#FFFBF5",
          color: "#1c1917",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Something went wrong</h1>
          <p style={{ color: "#78716c", marginBottom: "1.5rem" }}>
            A critical error occurred. Please try reloading the page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              borderRadius: "9999px",
              background: "#B45309",
              color: "#fff",
              border: "none",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
