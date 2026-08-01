export function MediaFallback({ className = "" }: { className?: string }) {
  return <div className={`media-fallback ${className}`} aria-hidden="true" />;
}
