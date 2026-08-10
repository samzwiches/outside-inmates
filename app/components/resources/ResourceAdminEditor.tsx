"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type AdminResourceRow = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  categories: string;
  services: string;
  eligibility: string;
  location: string;
  city: string;
  state: string;
  zip_code: string;
  service_area: string;
  phone: string;
  website: string;
  email: string;
  hours: string;
  cost: string;
  service_area_type: string;
  verification_status: string;
  source_url: string;
  source_type: string;
  review_notes: string;
  verified_date: string | null;
  status: string;
  published: boolean;
  featured: boolean;
  free_or_low_cost: boolean;
};

type Status = { kind: "idle" | "saving" | "success" | "error"; message: string };

const emptyResource: AdminResourceRow = {
  id: "", name: "", slug: "", short_description: "", full_description: "", categories: "", services: "", eligibility: "", location: "", city: "", state: "", zip_code: "", service_area: "", phone: "", website: "", email: "", hours: "", cost: "", service_area_type: "Statewide", verification_status: "Needs review", source_url: "", source_type: "Official source", review_notes: "", verified_date: null, status: "draft", published: false, featured: false, free_or_low_cost: true,
};

export function ResourceAdminEditor({ resources }: { resources: AdminResourceRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(resources);
  const [query, setQuery] = useState("");
  const [justiceOnly, setJusticeOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(resources[0]?.id ?? "new");
  const selected = selectedId === "new" ? emptyResource : rows.find((row) => row.id === selectedId) ?? emptyResource;
  const [draft, setDraft] = useState<AdminResourceRow>(selected);
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows.filter((row) => {
      const justice = /jails and corrections|courts/i.test(row.categories);
      if (justiceOnly && !justice) return false;
      if (!term) return true;
      return `${row.name} ${row.city} ${row.state} ${row.phone} ${row.categories} ${row.services}`.toLowerCase().includes(term);
    });
  }, [rows, query, justiceOnly]);

  function choose(row: AdminResourceRow | null) {
    setSelectedId(row?.id ?? "new");
    setDraft(row ? { ...row } : { ...emptyResource });
    setStatus({ kind: "idle", message: "" });
  }

  function update<K extends keyof AdminResourceRow>(field: K, value: AdminResourceRow[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setStatus({ kind: "idle", message: "" });
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setStatus({ kind: "saving", message: "Saving resource…" });
    const response = await fetch("/api/admin/resources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
    const payload = await response.json().catch(() => null);
    if (!response.ok) { setStatus({ kind: "error", message: payload?.error ?? "The resource could not be saved." }); return; }
    const saved = payload.resource as AdminResourceRow;
    setRows((current) => current.some((row) => row.id === saved.id) ? current.map((row) => row.id === saved.id ? saved : row) : [saved, ...current]);
    setSelectedId(saved.id); setDraft(saved); setStatus({ kind: "success", message: "Resource saved." }); router.refresh();
  }

  return <div className="container resource-admin-shell">
    <aside className="resource-admin-list"><div className="resource-admin-list-heading"><p className="eyebrow">Resource editor</p><h1>Manage the directory.</h1><button className="button button-primary" type="button" onClick={() => choose(null)}>Add resource</button></div><label>Search<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, state, phone, category…" /></label><label className="resource-admin-check"><input type="checkbox" checked={justiceOnly} onChange={(event) => setJusticeOnly(event.target.checked)} /> Jails + courts only</label><p className="resource-admin-count">{filtered.length} shown · {rows.length} total</p><div className="resource-admin-results">{filtered.map((row) => <button className={row.id === selectedId ? "is-active" : ""} type="button" onClick={() => choose(row)} key={row.id}><strong>{row.name}</strong><span>{row.state || "National"} · {row.categories || "Uncategorized"}</span><small>{row.phone || "No phone listed"}</small></button>)}</div></aside>

    <form className="resource-admin-form" onSubmit={save}><header><p className="eyebrow">{draft.id ? "Edit resource" : "New resource"}</p><h2>{draft.name || "Add a directory listing"}</h2></header><div className="resource-admin-fields">
      <label className="is-wide">Name<input value={draft.name} onChange={(e) => update("name", e.target.value)} required /></label>
      <label>Slug<input value={draft.slug} onChange={(e) => update("slug", e.target.value)} placeholder="auto-created if blank" /></label>
      <label>State<input value={draft.state} maxLength={2} onChange={(e) => update("state", e.target.value.toUpperCase())} placeholder="KY" /></label>
      <label>City<input value={draft.city} onChange={(e) => update("city", e.target.value)} /></label>
      <label>ZIP code<input value={draft.zip_code} onChange={(e) => update("zip_code", e.target.value)} /></label>
      <label>Phone<input value={draft.phone} onChange={(e) => update("phone", e.target.value)} /></label>
      <label>Website<input value={draft.website} onChange={(e) => update("website", e.target.value)} /></label>
      <label>Email<input value={draft.email} onChange={(e) => update("email", e.target.value)} /></label>
      <label>Service area<input value={draft.service_area} onChange={(e) => update("service_area", e.target.value)} /></label>
      <label>Service area type<select value={draft.service_area_type} onChange={(e) => update("service_area_type", e.target.value)}><option>Local</option><option>Statewide</option><option>Remote / national</option></select></label>
      <label className="is-wide">Categories<input value={draft.categories} onChange={(e) => update("categories", e.target.value)} placeholder="Jails and Corrections;Courts" /><small>Separate categories with semicolons.</small></label>
      <label className="is-wide">Services<input value={draft.services} onChange={(e) => update("services", e.target.value)} placeholder="Facility directory;Court information;Clerk contacts" /></label>
      <label className="is-wide">Short description<textarea rows={3} value={draft.short_description} onChange={(e) => update("short_description", e.target.value)} /></label>
      <label className="is-wide">Full description<textarea rows={5} value={draft.full_description} onChange={(e) => update("full_description", e.target.value)} /></label>
      <label className="is-wide">Eligibility / who it serves<textarea rows={3} value={draft.eligibility} onChange={(e) => update("eligibility", e.target.value)} /></label>
      <label>Hours<input value={draft.hours} onChange={(e) => update("hours", e.target.value)} /></label>
      <label>Cost<input value={draft.cost} onChange={(e) => update("cost", e.target.value)} /></label>
      <label className="is-wide">Source URL<input value={draft.source_url} onChange={(e) => update("source_url", e.target.value)} /></label>
      <label>Source type<input value={draft.source_type} onChange={(e) => update("source_type", e.target.value)} /></label>
      <label>Verified date<input type="date" value={draft.verified_date ?? ""} onChange={(e) => update("verified_date", e.target.value || null)} /></label>
      <label>Verification status<select value={draft.verification_status} onChange={(e) => update("verification_status", e.target.value)}><option>Needs review</option><option>Verified</option><option>Needs re-verification</option></select></label>
      <label>Status<select value={draft.status} onChange={(e) => update("status", e.target.value)}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
      <label className="resource-admin-check"><input type="checkbox" checked={draft.published} onChange={(e) => update("published", e.target.checked)} /> Published</label>
      <label className="resource-admin-check"><input type="checkbox" checked={draft.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured</label>
      <label className="resource-admin-check"><input type="checkbox" checked={draft.free_or_low_cost} onChange={(e) => update("free_or_low_cost", e.target.checked)} /> Free / low cost</label>
      <label className="is-wide">Review notes<textarea rows={4} value={draft.review_notes} onChange={(e) => update("review_notes", e.target.value)} /></label>
    </div>{status.message ? <p className={`resource-admin-status is-${status.kind}`} role="status">{status.message}</p> : null}<button className="button button-primary" type="submit" disabled={status.kind === "saving"}>{status.kind === "saving" ? "Saving…" : "Save resource"}</button></form>
  </div>;
}
