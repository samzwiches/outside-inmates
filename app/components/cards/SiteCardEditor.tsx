"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteCardDefinition } from "../../data/card-registry";
import type { SavedSiteCard } from "../../lib/site-card-server";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";
import type { SupabasePublicConfig } from "../../lib/supabase/types";

type EditorProps = { definitions: SiteCardDefinition[]; saved: SavedSiteCard[]; supabaseConfig: SupabasePublicConfig | null };
type Values = { title: string; description: string; eyebrow: string; actionLabel: string; href: string; secondaryActionLabel: string; secondaryHref: string; tone: string; imageAlt: string; focalX: string; focalY: string };
type Status = { kind: "idle" | "saving" | "success" | "error"; message: string };
type Upload = { bucket: string; path: string; token: string };

function valuesFor(definition: SiteCardDefinition, row?: SavedSiteCard): Values {
  return {
    title: row?.title ?? definition.title ?? "",
    description: row?.description ?? definition.description ?? "",
    eyebrow: row?.eyebrow ?? definition.eyebrow ?? "",
    actionLabel: row?.action_label ?? definition.actionLabel ?? "",
    href: row?.href ?? definition.href ?? "",
    secondaryActionLabel: row?.secondary_action_label ?? definition.secondaryActionLabel ?? "",
    secondaryHref: row?.secondary_href ?? definition.secondaryHref ?? "",
    tone: row?.tone ?? definition.tone ?? "",
    imageAlt: row?.image_alt ?? "",
    focalX: String(row?.focal_x ?? 50),
    focalY: String(row?.focal_y ?? 50),
  };
}

function recordError(payload: unknown, fallback: string) {
  return typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string" ? payload.error : fallback;
}

export function SiteCardEditor({ definitions, saved, supabaseConfig }: EditorProps) {
  const router = useRouter();
  const [records, setRecords] = useState(saved);
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState(definitions[0]?.key ?? "");
  const selectedDefinition = definitions.find((item) => item.key === selectedKey) ?? definitions[0];
  const selectedRow = records.find((row) => row.card_key === selectedDefinition?.key);
  const [values, setValues] = useState<Values>(() => selectedDefinition ? valuesFor(selectedDefinition, selectedRow) : valuesFor({ key: "", group: "", page: "", section: "", title: "" }));
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const [dirty, setDirty] = useState(false);
  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : null, [file]);

  useEffect(() => setRecords(saved), [saved]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => {
    if (!selectedDefinition) return;
    const row = records.find((item) => item.card_key === selectedDefinition.key);
    setValues(valuesFor(selectedDefinition, row));
    setFile(null);
    setRemoveImage(false);
    setDirty(false);
    setStatus({ kind: "idle", message: "" });
  }, [selectedDefinition?.key]);
  useEffect(() => {
    function warn(event: BeforeUnloadEvent) { if (!dirty) return; event.preventDefault(); event.returnValue = ""; }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = definitions.filter((card) => !term || `${card.key} ${card.group} ${card.page} ${card.section} ${card.title}`.toLowerCase().includes(term));
    return [...new Set(filtered.map((card) => card.group))].map((group) => ({ group, cards: filtered.filter((card) => card.group === group) }));
  }, [definitions, query]);

  if (!selectedDefinition) return <div className="container card-editor-empty">No editable cards are registered yet.</div>;

  function update<K extends keyof Values>(field: K, value: Values[K]) { setValues((current) => ({ ...current, [field]: value })); setDirty(true); setStatus({ kind: "idle", message: "" }); }

  function chooseCard(key: string) {
    if (key === selectedKey) return;
    if (dirty && !window.confirm("You have unsaved card changes. Switch cards and discard them?")) return;
    setSelectedKey(key);
  }

  async function chooseImage(nextFile: File | null) {
    if (!nextFile) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(nextFile.type)) { setStatus({ kind: "error", message: "Choose a JPG, PNG, or WebP image." }); return; }
    if (nextFile.size > 6 * 1024 * 1024) { setStatus({ kind: "error", message: "Images must be 6 MB or smaller." }); return; }
    setFile(nextFile); setRemoveImage(false); setDirty(true); setStatus({ kind: "idle", message: "" });
  }

  async function uploadImage(): Promise<string | null> {
    if (!file) return null;
    if (!supabaseConfig) throw new Error("Card image uploads are not configured for this environment.");
    const response = await fetch("/api/admin/cards/upload-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardKey: selectedDefinition.key, name: file.name, type: file.type, size: file.size }) });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(recordError(payload, "The image upload could not be prepared."));
    const upload = payload?.upload as Upload | undefined;
    if (!upload?.bucket || !upload.path || !upload.token) throw new Error("The image upload could not be prepared.");
    const client = createSupabaseBrowserClient(supabaseConfig);
    const { error } = await client.storage.from(upload.bucket).uploadToSignedUrl(upload.path, upload.token, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
    if (error) throw new Error("The image could not be uploaded. Please try again.");
    return upload.path;
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setStatus({ kind: "saving", message: file ? "Uploading image…" : "Saving card…" });
    try {
      const imageStoragePath = await uploadImage();
      const response = await fetch("/api/admin/cards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardKey: selectedDefinition.key, ...values, imageStoragePath, removeImage }) });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(recordError(payload, "The card could not be saved."));
      setStatus({ kind: "success", message: "Card saved. The public pages will use these values." });
      setDirty(false); setFile(null); setRemoveImage(false); router.refresh();
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "The card could not be saved." });
    }
  }

  async function resetCard() {
    if (!window.confirm("Reset this card to its built-in text, links, colors, and image fallback?")) return;
    setStatus({ kind: "saving", message: "Resetting card…" });
    const response = await fetch(`/api/admin/cards?cardKey=${encodeURIComponent(selectedDefinition.key)}`, { method: "DELETE" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) { setStatus({ kind: "error", message: recordError(payload, "The card could not be reset.") }); return; }
    setValues(valuesFor(selectedDefinition)); setFile(null); setRemoveImage(false); setDirty(false); setStatus({ kind: "success", message: "Card reset to its built-in defaults." }); router.refresh();
  }

  const imageSource = previewUrl ?? (!removeImage ? selectedRow?.imageUrl : null) ?? null;

  return <div className="container card-editor-shell">
    <aside className="card-editor-nav">
      <div className="card-editor-nav-heading"><p className="eyebrow">Card editor</p><h1>Edit cards across the site.</h1><p>Text, links, color tone, and an optional card-specific image can be changed here without touching page code.</p></div>
      <label className="card-editor-search">Find a card<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search page, section, or card…" /></label>
      <div className="card-editor-groups">{groups.map(({ group, cards }) => <section key={group}><h2>{group}</h2>{cards.map((card) => <button className={card.key === selectedDefinition.key ? "is-active" : ""} type="button" onClick={() => chooseCard(card.key)} key={card.key}><strong>{card.title}</strong><span>{card.page} · {card.section}</span></button>)}</section>)}</div>
    </aside>

    <form className="card-editor-form" onSubmit={save}>
      <header><div><p className="eyebrow">{selectedDefinition.page} · {selectedDefinition.section}</p><h2>{selectedDefinition.title}</h2><code>{selectedDefinition.key}</code></div><button type="button" className="quiet-link card-reset" onClick={resetCard}>Reset to defaults</button></header>

      <div className="card-editor-preview">
        {imageSource ? <img src={imageSource} alt="Card image preview" style={{ objectPosition: `${values.focalX}% ${values.focalY}%` }} /> : <div><span>No card-specific image</span><small>The card keeps its normal color or shared image until you add one.</small></div>}
      </div>

      <div className="card-editor-fields">
        <label>Eyebrow / kicker<input value={values.eyebrow} onChange={(event) => update("eyebrow", event.target.value)} /></label>
        <label>Title<input value={values.title} onChange={(event) => update("title", event.target.value)} required /></label>
        <label className="is-wide">Description<textarea rows={4} value={values.description} onChange={(event) => update("description", event.target.value)} /></label>
        <label>Primary action label<input value={values.actionLabel} onChange={(event) => update("actionLabel", event.target.value)} /></label>
        <label>Primary link<input value={values.href} onChange={(event) => update("href", event.target.value)} placeholder="/resources" /></label>
        <label>Second action label<input value={values.secondaryActionLabel} onChange={(event) => update("secondaryActionLabel", event.target.value)} /></label>
        <label>Second link<input value={values.secondaryHref} onChange={(event) => update("secondaryHref", event.target.value)} placeholder="/resources/results?..." /></label>
        <label>Color tone<select value={values.tone} onChange={(event) => update("tone", event.target.value)}><option value="">Use card default</option><option value="clay">Clay</option><option value="sage">Sage</option><option value="blue">Storm blue</option><option value="ink">Deep ink</option><option value="paper">Paper</option></select></label>
        <label>Image alt text<input value={values.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} placeholder="Describe the image briefly" /></label>
        <label className="is-wide">Card image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseImage(event.target.files?.[0] ?? null)} /><small>Optional. JPG, PNG, or WebP, up to 6 MB.</small></label>
        <label>Horizontal focal point<input type="range" min="0" max="100" value={values.focalX} onChange={(event) => update("focalX", event.target.value)} /><small>{values.focalX}%</small></label>
        <label>Vertical focal point<input type="range" min="0" max="100" value={values.focalY} onChange={(event) => update("focalY", event.target.value)} /><small>{values.focalY}%</small></label>
      </div>

      {selectedRow?.image_storage_path && !removeImage ? <button type="button" className="button button-secondary" onClick={() => { setRemoveImage(true); setFile(null); setDirty(true); }}>Remove card-specific image</button> : null}
      {status.message ? <p className={`card-editor-status is-${status.kind}`} role="status">{status.message}</p> : null}
      <button className="button button-primary" type="submit" disabled={status.kind === "saving"}>{status.kind === "saving" ? "Saving…" : "Save card"}</button>
    </form>
  </div>;
}
