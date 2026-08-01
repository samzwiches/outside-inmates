"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { siteMediaGroups, siteMediaKeys, siteMediaRegistry, type AppearanceEditorField, type MediaOverlayTone, type SiteMediaKey } from "../../data/media";
import { normalizeAppearanceColor, type SiteSectionAppearance } from "../../lib/site-appearance";
import type { SavedSiteMedia } from "../../lib/site-media-server";

type EditorProps = { media: SavedSiteMedia[]; appearances: SiteSectionAppearance[] };
type Status = { kind: "idle" | "saving" | "success" | "error"; message: string };

type MediaValues = {
  altText: string;
  caption: string;
  creditName: string;
  creditUrl: string;
  sourceName: string;
  sourceUrl: string;
  licenseLabel: string;
  focalX: string;
  focalY: string;
  mobileFocalX: string;
  mobileFocalY: string;
  overlayTone: MediaOverlayTone;
  overlayColor: string;
  overlayOpacity: string;
  showOnMobile: boolean;
};

type AppearanceValues = Record<Exclude<AppearanceEditorField, "font_family" | "hero_edge_style" | "hero_edge_size">, string> & {
  font_family: string;
  hero_edge_style: string;
  hero_edge_size: string;
};

const colorLabels: Record<string, string> = {
  background_color: "Background color",
  surface_color: "Surface color",
  border_color: "Border color",
  default_text_color: "Default text color",
  eyebrow_color: "Eyebrow color",
  heading_color: "Heading color",
  body_color: "Body color",
  button_text_color: "Button text color",
  metadata_color: "Metadata color",
};

const overlayColors: Record<MediaOverlayTone, string> = {
  none: "transparent",
  light: "#fcfaf6",
  dark: "#18242b",
  cream: "#f3eee6",
  brand: "#647d8a",
};

function recordError(payload: unknown, fallback: string) {
  return typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string" ? payload.error : fallback;
}

function useObjectUrl(file: File | null) {
  const url = useMemo(() => file ? URL.createObjectURL(file) : null, [file]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return url;
}

function mediaValues(key: SiteMediaKey, record: SavedSiteMedia | undefined): MediaValues {
  const slot = siteMediaRegistry[key];
  return {
    altText: record?.alt_text ?? slot.alt,
    caption: record?.caption ?? "",
    creditName: record?.credit_name ?? slot.attribution?.creditName ?? "",
    creditUrl: record?.credit_url ?? slot.attribution?.creditUrl ?? "",
    sourceName: record?.source_name ?? slot.attribution?.sourceName ?? "",
    sourceUrl: record?.source_url ?? slot.attribution?.sourceUrl ?? "",
    licenseLabel: record?.license_label ?? slot.attribution?.licenseLabel ?? "",
    focalX: String(record?.focal_x ?? slot.objectPositionDesktop.x),
    focalY: String(record?.focal_y ?? slot.objectPositionDesktop.y),
    mobileFocalX: String(record?.mobile_focal_x ?? slot.objectPositionMobile.x),
    mobileFocalY: String(record?.mobile_focal_y ?? slot.objectPositionMobile.y),
    overlayTone: (record?.overlay_tone ?? slot.overlayTone) as MediaOverlayTone,
    overlayColor: record?.overlay_color ?? "",
    overlayOpacity: String(record?.overlay_opacity ?? slot.overlayOpacity),
    showOnMobile: record?.show_on_mobile ?? slot.showOnMobile,
  };
}

function appearanceValues(appearance: SiteSectionAppearance | undefined): AppearanceValues {
  return {
    background_color: appearance?.background_color ?? "",
    surface_color: appearance?.surface_color ?? "",
    border_color: appearance?.border_color ?? "",
    default_text_color: appearance?.default_text_color ?? "",
    eyebrow_color: appearance?.eyebrow_color ?? "",
    heading_color: appearance?.heading_color ?? "",
    body_color: appearance?.body_color ?? "",
    button_text_color: appearance?.button_text_color ?? "",
    metadata_color: appearance?.metadata_color ?? "",
    font_family: appearance?.font_family ?? "",
    hero_edge_style: appearance?.hero_edge_style ?? "",
    hero_edge_size: appearance?.hero_edge_size === null || appearance?.hero_edge_size === undefined ? "" : String(appearance.hero_edge_size),
  };
}

function contrastRatio(first: string, second: string) {
  function luminance(color: string) {
    const channels = color.slice(1).match(/.{2}/g)?.map((value) => Number.parseInt(value, 16) / 255) ?? [];
    const [r, g, b] = channels.map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const one = luminance(first);
  const two = luminance(second);
  return (Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05);
}

function MediaPreview({ label, source, x, y, mobile, overlay }: { label: string; source: string | null | undefined; x: string; y: string; mobile?: boolean; overlay: { color: string; opacity: string } }) {
  const hasSource = Boolean(source);
  return <figure className={`site-media-preview ${mobile ? "is-mobile" : ""}`}><div className="site-media-preview-frame">{hasSource ? <img src={source!} alt="" style={{ objectPosition: `${x || 50}% ${y || 50}%` }} onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.parentElement?.classList.add("is-missing"); }} /> : <span className="site-media-preview-empty">No image assigned</span>}{hasSource && Number(overlay.opacity) > 0 ? <span className="site-media-preview-overlay" style={{ backgroundColor: overlay.color, opacity: Number(overlay.opacity) }} /> : null}<span className="site-media-preview-marker" style={{ left: `${x || 50}%`, top: `${y || 50}%` }} aria-hidden="true" /></div><figcaption>{label}</figcaption></figure>;
}

export function SiteMediaEditor({ media, appearances }: EditorProps) {
  const router = useRouter();
  const primaryInput = useRef<HTMLInputElement>(null);
  const mobileInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<SiteMediaKey>("home.hero");
  const [records, setRecords] = useState(media);
  const [appearanceRecords, setAppearanceRecords] = useState(appearances);
  const selectedRecord = records.find((record) => record.media_key === selectedKey);
  const selectedAppearance = appearanceRecords.find((record) => record.section_key === selectedKey);
  const [values, setValues] = useState<MediaValues>(() => mediaValues("home.hero", media.find((record) => record.media_key === "home.hero")));
  const [appearance, setAppearance] = useState<AppearanceValues>(() => appearanceValues(appearances.find((record) => record.section_key === "home.hero")));
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [removeMobile, setRemoveMobile] = useState(false);
  const [mediaDirty, setMediaDirty] = useState(false);
  const [appearanceDirty, setAppearanceDirty] = useState(false);
  const [mediaStatus, setMediaStatus] = useState<Status>({ kind: "idle", message: "" });
  const [appearanceStatus, setAppearanceStatus] = useState<Status>({ kind: "idle", message: "" });
  const primaryPreview = useObjectUrl(primaryFile);
  const mobilePreview = useObjectUrl(mobileFile);
  const slot = siteMediaRegistry[selectedKey];

  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      if (!mediaDirty && !appearanceDirty) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [mediaDirty, appearanceDirty]);

  const groups = useMemo(() => siteMediaGroups.map((group) => ({
    group,
    slots: siteMediaKeys.filter((key) => siteMediaRegistry[key].group === group).filter((key) => {
      const term = query.trim().toLowerCase();
      const item = siteMediaRegistry[key];
      return !term || `${key} ${item.page} ${item.section} ${item.group}`.toLowerCase().includes(term);
    }),
  })).filter((group) => group.slots.length), [query]);

  const primarySource = primaryPreview ?? selectedRecord?.signedUrl ?? slot.fallbackPath ?? null;
  const mobileSource = mobilePreview ?? (!removeMobile ? selectedRecord?.mobileSignedUrl : null) ?? primarySource;
  const overlay = { color: normalizeAppearanceColor(values.overlayColor) ?? overlayColors[values.overlayTone], opacity: values.overlayOpacity };
  const headingColor = normalizeAppearanceColor(appearance.heading_color);
  const backgroundColor = normalizeAppearanceColor(appearance.background_color) ?? "#f3eee6";
  const lowContrast = Boolean(headingColor && contrastRatio(headingColor, backgroundColor) < 4.5);
  const invalidOverlay = Boolean(values.overlayColor && !normalizeAppearanceColor(values.overlayColor));
  const invalidAppearance = Object.entries(appearance).some(([field, value]) => field.endsWith("_color") && Boolean(value) && !normalizeAppearanceColor(value));

  function chooseSlot(key: SiteMediaKey) {
    if ((mediaDirty || appearanceDirty) && !window.confirm("You have unsaved media or appearance changes. Switch locations and discard them?")) return;
    const nextRecord = records.find((record) => record.media_key === key);
    const nextAppearance = appearanceRecords.find((record) => record.section_key === key);
    setSelectedKey(key);
    setValues(mediaValues(key, nextRecord));
    setAppearance(appearanceValues(nextAppearance));
    setPrimaryFile(null);
    setMobileFile(null);
    setRemoveMobile(false);
    setMediaDirty(false);
    setAppearanceDirty(false);
    setMediaStatus({ kind: "idle", message: "" });
    setAppearanceStatus({ kind: "idle", message: "" });
  }

  function updateMedia<K extends keyof MediaValues>(field: K, value: MediaValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setMediaDirty(true);
    setMediaStatus({ kind: "idle", message: "" });
  }

  function updateAppearance<K extends keyof AppearanceValues>(field: K, value: AppearanceValues[K]) {
    setAppearance((current) => ({ ...current, [field]: value }));
    setAppearanceDirty(true);
    setAppearanceStatus({ kind: "idle", message: "" });
  }

  function validateClientImage(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "Choose a JPG, PNG, or WebP image.";
    if (file.size > 6 * 1024 * 1024) return "Images must be 6 MB or smaller.";
    return null;
  }

  function setImageFile(file: File | null, target: "primary" | "mobile") {
    if (!file) return;
    const error = validateClientImage(file);
    if (error) {
      setMediaStatus({ kind: "error", message: error });
      return;
    }
    if (target === "primary") setPrimaryFile(file);
    else {
      setMobileFile(file);
      setRemoveMobile(false);
    }
    setMediaDirty(true);
  }

  async function saveMedia(event: React.FormEvent) {
    event.preventDefault();
    if (!primaryFile && !selectedRecord) {
      setMediaStatus({ kind: "error", message: "Upload a primary image before saving this location." });
      return;
    }
    if (!values.altText.trim()) {
      setMediaStatus({ kind: "error", message: "Write concise alt text before saving an uploaded image." });
      return;
    }
    if (invalidOverlay) {
      setMediaStatus({ kind: "error", message: "Use a three- or six-digit hexadecimal value for the custom overlay color." });
      return;
    }
    setMediaStatus({ kind: "saving", message: "Saving media…" });
    const formData = new FormData();
    formData.set("mediaKey", selectedKey);
    formData.set("altText", values.altText);
    formData.set("caption", values.caption);
    formData.set("creditName", values.creditName);
    formData.set("creditUrl", values.creditUrl);
    formData.set("sourceName", values.sourceName);
    formData.set("sourceUrl", values.sourceUrl);
    formData.set("licenseLabel", values.licenseLabel);
    formData.set("focalX", values.focalX);
    formData.set("focalY", values.focalY);
    formData.set("mobileFocalX", values.mobileFocalX);
    formData.set("mobileFocalY", values.mobileFocalY);
    formData.set("overlayTone", values.overlayTone);
    formData.set("overlayColor", values.overlayColor);
    formData.set("overlayOpacity", values.overlayOpacity);
    formData.set("showOnMobile", String(values.showOnMobile));
    formData.set("removeMobile", String(removeMobile));
    if (primaryFile) formData.set("primaryImage", primaryFile);
    if (mobileFile) formData.set("mobileImage", mobileFile);

    const response = await fetch("/api/admin/site-media", { method: "POST", body: formData });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setMediaStatus({ kind: "error", message: recordError(payload, "The media assignment could not be saved.") });
      return;
    }
    setMediaStatus({ kind: "success", message: "Media saved. The affected public page has been refreshed." });
    setMediaDirty(false);
    setRemoveMobile(false);
    if (payload?.media) {
      setRecords((current) => {
        const saved = { ...payload.media, signedUrl: primaryPreview ?? selectedRecord?.signedUrl ?? "", mobileSignedUrl: mobilePreview ?? (!removeMobile ? selectedRecord?.mobileSignedUrl ?? null : null) } as SavedSiteMedia;
        return [...current.filter((record) => record.media_key !== selectedKey), saved];
      });
    }
    router.refresh();
  }

  async function resetMedia() {
    if (!selectedRecord || !window.confirm("Reset this location to its source-controlled fallback? Uploaded files are deleted only when no other assignment uses them.")) return;
    setMediaStatus({ kind: "saving", message: "Resetting media…" });
    const response = await fetch(`/api/admin/site-media?mediaKey=${encodeURIComponent(selectedKey)}`, { method: "DELETE" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setMediaStatus({ kind: "error", message: recordError(payload, "The media assignment could not be reset.") });
      return;
    }
    setRecords((current) => current.filter((record) => record.media_key !== selectedKey));
    setValues(mediaValues(selectedKey, undefined));
    setPrimaryFile(null);
    setMobileFile(null);
    setRemoveMobile(false);
    setMediaDirty(false);
    setMediaStatus({ kind: "success", message: "Media reset. The source fallback, or the existing text-only layout, is active again." });
    router.refresh();
  }

  async function saveAppearance() {
    if (invalidAppearance) {
      setAppearanceStatus({ kind: "error", message: "Use only three- or six-digit hexadecimal colors before saving appearance settings." });
      return;
    }
    if (lowContrast) {
      setAppearanceStatus({ kind: "error", message: "The heading color has low contrast against the chosen background. Choose a clearer combination." });
      return;
    }
    setAppearanceStatus({ kind: "saving", message: "Saving appearance…" });
    const response = await fetch("/api/admin/site-media", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sectionKey: selectedKey, ...appearance }) });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setAppearanceStatus({ kind: "error", message: recordError(payload, "The appearance settings could not be saved.") });
      return;
    }
    setAppearanceStatus({ kind: "success", message: "Appearance saved. The affected public page has been refreshed." });
    setAppearanceDirty(false);
    if (payload?.appearance) setAppearanceRecords((current) => [...current.filter((record) => record.section_key !== selectedKey), payload.appearance as SiteSectionAppearance]);
    router.refresh();
  }

  async function resetAppearance() {
    if (!selectedAppearance || !window.confirm("Reset these safe appearance overrides without changing the media assignment?")) return;
    setAppearanceStatus({ kind: "saving", message: "Resetting appearance…" });
    const response = await fetch(`/api/admin/site-media?appearanceKey=${encodeURIComponent(selectedKey)}`, { method: "DELETE" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setAppearanceStatus({ kind: "error", message: recordError(payload, "The appearance settings could not be reset.") });
      return;
    }
    setAppearanceRecords((current) => current.filter((record) => record.section_key !== selectedKey));
    setAppearance(appearanceValues(undefined));
    setAppearanceDirty(false);
    setAppearanceStatus({ kind: "success", message: "Appearance reset. The source-controlled treatment is active again." });
    router.refresh();
  }

  const sourceStatus = selectedRecord ? "Current uploaded image" : slot.fallbackPath ? "Source-controlled fallback" : "No image assigned";
  const permittedAppearance = (field: AppearanceEditorField) => slot.allowedAppearanceFields.includes(field);

  return <section className="site-media-editor" aria-labelledby="site-media-heading"><div className="container site-media-editor-intro"><p className="eyebrow">Administrator desk</p><h1 id="site-media-heading">Media + Appearance</h1><p>Assign approved images, choose a responsive crop, and make calm, limited presentation changes. This desk never edits page copy, navigation, or layouts.</p>{mediaDirty || appearanceDirty ? <p className="media-unsaved" role="status">Unsaved changes in this location.</p> : null}</div><div className="container site-media-workspace"><aside className="site-media-sidebar"><label htmlFor="site-media-search">Find a location<input id="site-media-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Key, page, or label" /></label><p className="site-media-count">{groups.reduce((count, group) => count + group.slots.length, 0)} of {siteMediaKeys.length} approved locations</p><nav aria-label="Media locations">{groups.map((group) => <section className="site-media-slot-group" key={group.group}><h2>{group.group}</h2>{group.slots.map((key) => { const item = siteMediaRegistry[key]; const assigned = records.some((record) => record.media_key === key); return <button key={key} type="button" onClick={() => chooseSlot(key)} aria-current={selectedKey === key ? "true" : undefined} className={selectedKey === key ? "is-active" : ""}><span>{item.section}</span><small>{key} · {assigned ? "uploaded" : item.fallbackPath ? "fallback" : "empty"}</small></button>; })}</section>)}</nav></aside><div className="site-media-detail"><header className="site-media-detail-heading"><div><p className="eyebrow">{slot.page} · {slot.placement}</p><h2>{slot.section}</h2><p><code>{selectedKey}</code> · {sourceStatus}</p></div><span className={`site-media-source-status ${selectedRecord ? "is-uploaded" : ""}`}>{sourceStatus}</span></header><div className="site-media-preview-grid"><MediaPreview label="Desktop preview" source={primarySource} x={values.focalX} y={values.focalY} overlay={overlay} /><MediaPreview label="Mobile preview" source={values.showOnMobile ? mobileSource : null} x={values.mobileFocalX} y={values.mobileFocalY} mobile overlay={overlay} /></div>{slot.fallbackPath ? <p className="site-media-fallback-note">Fallback: <code>{slot.expectedLocalFilename}</code>. It is never deleted by this desk; if the file is missing, the public layout remains calm and text-first.</p> : <p className="site-media-fallback-note">This approved location has no source-controlled image. Resetting it returns to the existing text-only surface.</p>}<form className="site-media-form" onSubmit={saveMedia}><fieldset><legend>Image assignment</legend><div className="site-media-file-grid"><div><p>Primary image</p><input ref={primaryInput} className="sr-only" id="primary-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImageFile(event.target.files?.[0] ?? null, "primary")} /><button className="button button-secondary" type="button" onClick={() => primaryInput.current?.click()}>{primaryFile ? "Replace selected image" : selectedRecord ? "Replace current image" : "Upload primary image"}</button>{primaryFile ? <small>{primaryFile.name}</small> : selectedRecord ? <small>Uploaded image assigned</small> : <small>JPG, PNG, or WebP · 6 MB maximum</small>}</div><div><p>Optional mobile crop</p><input ref={mobileInput} className="sr-only" id="mobile-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImageFile(event.target.files?.[0] ?? null, "mobile")} /><button className="button button-secondary" type="button" onClick={() => mobileInput.current?.click()}>{mobileFile ? "Replace selected crop" : selectedRecord?.mobile_storage_path ? "Replace mobile crop" : "Upload mobile crop"}</button>{selectedRecord?.mobile_storage_path || mobileFile ? <label className="compact-checkbox"><input type="checkbox" checked={removeMobile} onChange={(event) => { setRemoveMobile(event.target.checked); setMediaDirty(true); }} /> Remove mobile crop</label> : <small>Use a different crop when the desktop framing will not translate.</small>}</div></div></fieldset><fieldset><legend>Meaning and credit</legend><label>Alt text<textarea value={values.altText} onChange={(event) => updateMedia("altText", event.target.value)} maxLength={500} rows={3} required /></label><p className="control-help">Describe the useful visual information. Do not use a filename or repeat nearby copy.</p><div className="site-media-form-grid"><label>Caption <input value={values.caption} onChange={(event) => updateMedia("caption", event.target.value)} maxLength={500} /></label><label>Photographer / creator <input value={values.creditName} onChange={(event) => updateMedia("creditName", event.target.value)} maxLength={200} /></label><label>Credit URL <input type="url" value={values.creditUrl} onChange={(event) => updateMedia("creditUrl", event.target.value)} placeholder="https://…" /></label><label>Source name <input value={values.sourceName} onChange={(event) => updateMedia("sourceName", event.target.value)} maxLength={200} /></label><label>Source URL <input type="url" value={values.sourceUrl} onChange={(event) => updateMedia("sourceUrl", event.target.value)} placeholder="https://…" /></label><label>License label <input value={values.licenseLabel} onChange={(event) => updateMedia("licenseLabel", event.target.value)} maxLength={200} /></label></div></fieldset><fieldset><legend>Crop framing</legend><p className="control-help">Move the focal point by percentage; the preview shows the resulting object position without altering the image file.</p><div className="site-media-form-grid"><label>Desktop focal — across <input type="number" min="0" max="100" step="1" value={values.focalX} onChange={(event) => updateMedia("focalX", event.target.value)} /></label><label>Desktop focal — down <input type="number" min="0" max="100" step="1" value={values.focalY} onChange={(event) => updateMedia("focalY", event.target.value)} /></label><label>Mobile focal — across <input type="number" min="0" max="100" step="1" value={values.mobileFocalX} onChange={(event) => updateMedia("mobileFocalX", event.target.value)} /></label><label>Mobile focal — down <input type="number" min="0" max="100" step="1" value={values.mobileFocalY} onChange={(event) => updateMedia("mobileFocalY", event.target.value)} /></label></div><label className="compact-checkbox"><input type="checkbox" checked={values.showOnMobile} onChange={(event) => updateMedia("showOnMobile", event.target.checked)} /> Show this image on mobile</label></fieldset><fieldset><legend>Image overlay</legend><div className="site-media-form-grid"><label>Preset tone<select value={values.overlayTone} onChange={(event) => updateMedia("overlayTone", event.target.value as MediaOverlayTone)}><option value="none">No overlay</option><option value="light">Light paper</option><option value="dark">Deep ink</option><option value="cream">Warm bone</option><option value="brand">Storm blue</option></select></label><label>Custom overlay color <input value={values.overlayColor} onChange={(event) => updateMedia("overlayColor", event.target.value)} placeholder="#18242b" aria-invalid={invalidOverlay} /></label><label>Overlay opacity <input type="number" min="0" max="0.72" step="0.01" value={values.overlayOpacity} onChange={(event) => updateMedia("overlayOpacity", event.target.value)} /></label></div>{invalidOverlay ? <p className="control-error">Use a three- or six-digit hex value, such as <code>#647d8a</code>. A valid custom color takes precedence over the preset.</p> : <p className="control-help">Custom color overrides the preset; clear it to return to the selected tone. Keep overlays light enough that the image still feels human.</p>}</fieldset><div className="site-media-actions"><button className="button button-primary" type="submit" disabled={mediaStatus.kind === "saving"}>{mediaStatus.kind === "saving" ? "Saving…" : "Save media"}</button>{selectedRecord ? <button className="button button-secondary button-danger" type="button" onClick={resetMedia} disabled={mediaStatus.kind === "saving"}>Reset Media</button> : null}</div>{mediaStatus.kind !== "idle" ? <p className={`editor-status ${mediaStatus.kind === "error" ? "is-error" : mediaStatus.kind === "success" ? "is-success" : ""}`} role="status">{mediaStatus.message}</p> : null}</form><section className="site-appearance-panel" aria-labelledby="appearance-heading"><div><p className="eyebrow">Safe presentation only</p><h2 id="appearance-heading">Appearance</h2><p>These controls apply only to this approved hero or section. They cannot add CSS, layout rules, gradients, or page content.</p></div><div className="appearance-controls">{Object.entries(colorLabels).filter(([field]) => permittedAppearance(field as AppearanceEditorField)).map(([field, label]) => { const current = appearance[field as keyof AppearanceValues] as string; const normalized = normalizeAppearanceColor(current); return <label key={field}>{label}<span className="color-input-row"><input aria-label={`${label} picker`} type="color" value={normalized ?? "#18242b"} onChange={(event) => updateAppearance(field as keyof AppearanceValues, event.target.value)} /><input value={current} onChange={(event) => updateAppearance(field as keyof AppearanceValues, event.target.value)} placeholder="#18242b" aria-invalid={Boolean(current && !normalized)} /></span></label>; })}{permittedAppearance("font_family") ? <label>Font family<select value={appearance.font_family} onChange={(event) => updateAppearance("font_family", event.target.value)}><option value="">Use current design</option><option value="inherit">Inherit</option><option value="serif">Editorial serif</option><option value="sans">Interface sans</option></select></label> : null}{permittedAppearance("hero_edge_style") ? <label>Hero edge<select value={appearance.hero_edge_style} onChange={(event) => updateAppearance("hero_edge_style", event.target.value)}><option value="">Use current design</option><option value="inherit">Inherit</option><option value="soft-fade">Soft fade</option><option value="rounded">Rounded</option><option value="rounded-fade">Rounded with fade</option><option value="none">Hard rectangle</option></select></label> : null}{permittedAppearance("hero_edge_size") ? <label>Hero edge size <input type="number" min="0" max="96" step="1" value={appearance.hero_edge_size} onChange={(event) => updateAppearance("hero_edge_size", event.target.value)} placeholder="20" /></label> : null}</div>{lowContrast ? <p className="contrast-warning" role="status">The chosen heading color has low contrast against the saved background. Image-backed text also needs a visual check in the preview.</p> : <p className="control-help">Hex colors only. Image-backed text should be checked against the assigned image and its overlay before saving.</p>}<div className="site-media-actions"><button className="button button-primary" type="button" onClick={saveAppearance} disabled={appearanceStatus.kind === "saving"}>{appearanceStatus.kind === "saving" ? "Saving…" : "Save appearance"}</button>{selectedAppearance ? <button className="button button-secondary button-danger" type="button" onClick={resetAppearance} disabled={appearanceStatus.kind === "saving"}>Reset Appearance</button> : null}</div>{appearanceStatus.kind !== "idle" ? <p className={`editor-status ${appearanceStatus.kind === "error" ? "is-error" : appearanceStatus.kind === "success" ? "is-success" : ""}`} role="status">{appearanceStatus.message}</p> : null}</section></div></div></section>;
}
