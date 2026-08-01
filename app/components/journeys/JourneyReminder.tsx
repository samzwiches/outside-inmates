export function JourneyReminder({ reminders }: { reminders: string[] }) {
  return <aside className="journey-reminder" aria-labelledby="journey-reminder-title"><p className="eyebrow">Important reminders</p><h2 id="journey-reminder-title">Keep the next step grounded.</h2><ul>{reminders.map((reminder) => <li key={reminder}>{reminder}</li>)}</ul></aside>;
}
