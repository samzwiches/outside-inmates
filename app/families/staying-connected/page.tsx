import type { Metadata } from "next";
import { FacilityInfoWorksheet } from "../../components/family/FacilityInfoWorksheet";
import { FamilyGuideLayout } from "../../components/family/FamilyGuideLayout";
import { SafetyNotice } from "../../components/family/SafetyNotice";

export const metadata: Metadata = { title: "Calls, Mail, and Communication | Outside Inmates", description: "General guidance for staying connected during incarceration." };

export default function StayingConnectedPage() {
  return <FamilyGuideLayout slug="staying-connected"><div className="guide-reading"><section><h2>Communication systems are not all the same.</h2><p>Phone calls, video visits, mail, email or electronic messaging, photos, packages, and approved payments can all follow different facility rules. Confirm the provider and current instructions directly with the facility before you set up an account.</p></section><section><h2>Keep communication information in one place.</h2><p>Facility phone numbers, mailing instructions, a resident or inmate number, the provider name, and visitation steps are easy to lose when you are stressed. Use the worksheet below for the details you have confirmed.</p></section><FacilityInfoWorksheet /><section><h2>Set communication boundaries that support you, too.</h2><p>Staying connected does not mean you have to answer every request immediately or take on every expense. It is okay to be clear about what you can do, what you need to think about, and what you cannot take on.</p></section><section><h2>Watch for common restrictions.</h2><p>Facilities may limit timing, frequency, approved contacts, content, account balances, and the type of photos or packages they allow. Rules can change, so check again before spending money or mailing something important.</p></section><SafetyNotice /></div></FamilyGuideLayout>;
}
