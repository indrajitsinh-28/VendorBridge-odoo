import React from "react";

/**
 * Full-page skeleton loader shown while a lazy chunk is being fetched.
 * Matches the app shell (sidebar + header + content area) so there's
 * no layout shift when the real page arrives.
 */
export function PageLoader() {
  return (
    <div className="flex h-screen bg-background overflow-hidden animate-pulse">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary/90 flex-shrink-0">
        {/* Logo row */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/20" />
          <div className="space-y-1.5">
            <div className="w-28 h-3 rounded-full bg-white/20" />
            <div className="w-20 h-2 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 px-3 py-4 space-y-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            >
              <div className="w-4 h-4 rounded bg-white/15 flex-shrink-0" />
              <div
                className="h-2.5 rounded-full bg-white/15"
                style={{ width: `${55 + (i % 4) * 12}px` }}
              />
            </div>
          ))}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header skeleton */}
        <header className="flex items-center gap-4 px-6 py-3 bg-card border-b border-muted/10 flex-shrink-0">
          <div className="flex-1 max-w-md h-9 rounded-xl bg-muted/10" />
          <div className="ml-auto flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-muted/10" />
            <div className="w-9 h-9 rounded-xl bg-muted/10" />
            <div className="w-24 h-9 rounded-xl bg-muted/10" />
          </div>
        </header>

        {/* Content skeleton */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
          {/* Page title */}
          <div className="space-y-2">
            <div className="w-40 h-7 rounded-xl bg-muted/15" />
            <div className="w-72 h-4 rounded-full bg-muted/10" />
          </div>

          {/* Stat cards row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-5 border border-muted/8 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="w-20 h-2.5 rounded-full bg-muted/15" />
                    <div className="w-12 h-7 rounded-xl bg-muted/15" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-muted/10" />
                </div>
                <div className="w-24 h-2.5 rounded-full bg-muted/10" />
              </div>
            ))}
          </div>

          {/* Table card */}
          <div className="bg-card rounded-2xl border border-muted/8 shadow-sm overflow-hidden">
            {/* Tabs row */}
            <div className="flex gap-1 px-4 pt-4 border-b border-muted/10 pb-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-20 rounded-t-xl bg-muted/10" />
              ))}
            </div>

            {/* Table header */}
            <div className="flex gap-4 px-4 py-3 border-b border-muted/8">
              {[140, 100, 160, 120, 80, 80].map((w, i) => (
                <div key={i} className="h-2.5 rounded-full bg-muted/15" style={{ width: w }} />
              ))}
            </div>

            {/* Table rows */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-3.5 border-b border-muted/6"
              >
                {/* Name cell with avatar */}
                <div className="flex items-center gap-3 w-36 flex-shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-muted/15 flex-shrink-0" />
                  <div className="space-y-1.5">
                    <div className="w-24 h-2.5 rounded-full bg-muted/15" />
                    <div className="w-14 h-2 rounded-full bg-muted/10" />
                  </div>
                </div>
                <div className="w-20 h-5 rounded-full bg-muted/10" />
                <div className="w-36 h-2.5 rounded-full bg-muted/10" />
                <div className="w-28 h-2.5 rounded-full bg-muted/10" />
                <div className="w-16 h-5 rounded-full bg-muted/10" />
                <div className="flex gap-1 ml-auto">
                  <div className="w-7 h-7 rounded-lg bg-muted/10" />
                  <div className="w-7 h-7 rounded-lg bg-muted/10" />
                  <div className="w-7 h-7 rounded-lg bg-muted/10" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * Lightweight inline spinner — used for auth pages and small suspense boundaries.
 */
export function SpinnerLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Branded spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/15" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          {/* Inner dot */}
          <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary/60" />
          </div>
        </div>
        <p className="text-sm font-medium text-muted">Loading…</p>
      </div>
    </div>
  );
}
