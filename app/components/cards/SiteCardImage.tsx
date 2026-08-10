type SiteCardImageProps = {
  src: string;
  alt: string;
  focalX?: number;
  focalY?: number;
  className?: string;
};

export function SiteCardImage({ src, alt, focalX = 50, focalY = 50, className = "" }: SiteCardImageProps) {
  return (
    <div className={`site-card-image ${className}`}>
      <img src={src} alt={alt} style={{ objectPosition: `${focalX}% ${focalY}%` }} />
    </div>
  );
}
