import { facilityWorksheetFields } from "../../data/family";

export function FacilityInfoWorksheet() {
  return <section className="facility-worksheet" aria-labelledby="facility-worksheet-title"><div><p className="eyebrow">Keep this nearby</p><h2 id="facility-worksheet-title">Facility information worksheet</h2><p>Nothing written here is saved or sent anywhere. Use it to keep the details you confirm in one place, then print it if useful.</p></div><div className="worksheet-fields">{facilityWorksheetFields.map((field) => <label key={field}>{field}<input type="text" autoComplete="off" /></label>)}</div></section>;
}
