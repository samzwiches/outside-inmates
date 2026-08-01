import { PrintableChecklist } from "../family/PrintableChecklist";

export function JourneyChecklist({ title, intro, items }: { title: string; intro: string; items: string[] }) {
  return <PrintableChecklist title={title} intro={intro} items={items} />;
}
