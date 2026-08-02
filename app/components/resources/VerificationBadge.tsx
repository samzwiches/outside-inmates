type VerificationBadgeProps = { emergency?: boolean; compact?: boolean };

export function VerificationBadge({ emergency = false, compact = false }: VerificationBadgeProps) {
  return (
    <span className={`verification-badge ${emergency ? "is-emergency" : ""} ${compact ? "is-compact" : ""}`}>
      <span className="verification-label">{emergency ? "Urgent support listing" : "Provider information"}</span>
      {!compact && <span className="verification-note">Confirm current details directly</span>}
    </span>
  );
}
