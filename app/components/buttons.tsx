type ButtonProps = { href: string; children: React.ReactNode; className?: string };

export function PrimaryButton({ href, children, className = "" }: ButtonProps) {
  return <a className={`button button-primary ${className}`} href={href}>{children}</a>;
}

export function SecondaryButton({ href, children, className = "" }: ButtonProps) {
  return <a className={`button button-secondary ${className}`} href={href}>{children}</a>;
}
