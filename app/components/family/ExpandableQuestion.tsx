"use client";

import { useId, useState } from "react";

export function ExpandableQuestion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  return <div className="expandable-question"><h3><button type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setIsOpen(!isOpen)}><span>{question}</span><span aria-hidden="true">{isOpen ? "−" : "+"}</span></button></h3><div id={id} hidden={!isOpen}><p>{answer}</p></div></div>;
}
