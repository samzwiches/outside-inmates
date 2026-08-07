#!/usr/bin/env python3
"""Build the Supabase resources import CSV from every maintained state source file."""

from __future__ import annotations

import csv
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "data" / "resources" / "recovery"
OUTPUT_PATH = SOURCE_DIR / "outside_inmates_resources_supabase_import.csv"

STATE_ABBR = {
    "Alabama": "AL",
    "District of Columbia": "DC",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Indiana": "IN",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Mississippi": "MS",
    "Missouri": "MO",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New York": "NY",
    "North Carolina": "NC",
    "Ohio": "OH",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "Tennessee": "TN",
    "Texas": "TX",
    "Vermont": "VT",
    "Virginia": "VA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
}

OUTPUT_COLUMNS = [
    "slug", "name", "short_description", "full_description", "categories",
    "services", "eligibility", "location", "city", "state", "zip_code",
    "counties_served", "service_area", "phone", "website", "email", "hours",
    "cost", "application_process", "documents_needed", "languages",
    "accessibility_notes", "verified_date", "featured", "emergency",
    "remote_services", "free_or_low_cost", "service_area_type",
    "is_demonstration", "status", "published",
]

CATEGORY_RULES = [
    ("Housing", ["housing", "house", "shelter", "residence", "residential", "halfway", "transitional", "sober living"]),
    ("Employment", ["employment", "job", "career", "workforce", "training", "apprentice"]),
    ("Identification and Documents", ["identification", "document", "id card", "state id", "non-driver id", "photo id", "dmv", "bmv", "rmv", "dds"]),
    ("Legal Help", ["legal", "lawyer", "civil legal", "lawline", "cori", "court"]),
    ("Family Support", ["family", "families", "parent", "children", "maternal", "pregnant", "mommy and me"]),
    ("Mental Health", ["mental health", "behavioral health", "crisis", "warm line", "psychiatric", "co-occurring", "dual-diagnosis"]),
    ("Substance Use Recovery", ["recovery", "substance use", "addiction", "sober", "detox", "oxford house", "harm reduction", "iop", "php", "saiop", "sacot", "outpatient", "opioid"]),
    ("Transportation", ["transportation", "transit", "ride"]),
    ("Education", ["education", "school", "credential", "literacy", "ged"]),
    ("Food and Basic Needs", ["food", "pantry", "basic needs", "clothing", "meal", "snap"]),
    ("Reentry Planning", ["reentry", "justice involved", "justice-involved", "correction", "parole", "probation", "supervision", "returning citizen", "formerly incarcerated"]),
    ("Communication and Visitation", ["visitation", "communication", "family contact"]),
]

SERVICE_RULES = [
    ("Resource navigation", ["resource navigator", "211", "directory", "locator", "finder", "availability dashboard"]),
    ("Housing referrals", ["housing assistance", "housing and shelter", "homelessness services"]),
    ("Emergency shelter", ["emergency shelter"]),
    ("Recovery housing", ["recovery housing", "sober living", "recovery residence", "recovery house"]),
    ("Oxford House", ["oxford house"]),
    ("Partial hospitalization", ["php", "partial hospitalization", "day treatment", "high intensity outpatient", "high-intensity outpatient", "sacot"]),
    ("Intensive outpatient", ["iop", "intensive outpatient", "intensive services", "saiop"]),
    ("Standard outpatient", ["outpatient"]),
    ("Residential recovery", ["residential recovery", "residential substance", "residential treatment", "residential rehabilitation"]),
    ("Medication support", ["medication", "mat", "moud", "buprenorphine", "methadone", "opioid treatment"]),
    ("Treatment referrals", ["helpline", "treatment and recovery directory", "access system", "access line", "treatment search"]),
    ("Reentry planning", ["reentry planning", "reentry navigation", "reentry services", "returning citizen"]),
    ("Transitional housing", ["transitional housing", "reentry housing"]),
    ("Legal assistance", ["legal help", "legal intake", "legal services", "lawline"]),
    ("Employment support", ["employment", "career center", "job center", "job seeker", "workforce"]),
    ("Food assistance", ["food", "pantry", "snap"]),
    ("Mental health support", ["mental health", "warm line", "behavioral health", "psychiatric", "crisis"]),
    ("Identification help", ["identification", "id card", "state id", "non-driver id", "photo id", "dmv", "bmv", "rmv", "dds"]),
    ("Peer support", ["peer support", "recovery community"]),
    ("Family support", ["family", "maternal", "parenting", "children"]),
]


def clean(value: str | None) -> str:
    return (value or "").strip()


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-zA-Z0-9]+", "-", ascii_value.lower()).strip("-")


def unique(values: list[str]) -> list[str]:
    output: list[str] = []
    seen: set[str] = set()
    for value in values:
        value = clean(value)
        if value and value.lower() not in seen:
            output.append(value)
            seen.add(value.lower())
    return output


def text_for(row: dict[str, str]) -> str:
    return " ".join([
        clean(row.get("resource_name")), clean(row.get("category")),
        clean(row.get("services")), clean(row.get("population_served")),
    ]).lower()


def categories_for(row: dict[str, str]) -> str:
    text = text_for(row)
    categories = [name for name, terms in CATEGORY_RULES if any(term in text for term in terms)]
    return ";".join(unique(categories or ["Reentry Planning"]))


def services_for(row: dict[str, str]) -> str:
    text = text_for(row)
    services = [name for name, terms in SERVICE_RULES if any(term in text for term in terms)]
    return ";".join(unique(services or [clean(row.get("category")) or "Community support"]))


def extract_zip(address: str) -> str:
    match = re.search(r"\b(\d{5})(?:-\d{4})?\b", clean(address))
    return match.group(1) if match else ""


def counties_from(service_area: str) -> str:
    value = clean(service_area)
    match = re.search(r"(.+?)\s+Count(?:y|ies)\b", value, re.I)
    if not match:
        return ""
    county_text = match.group(1).replace(" and ", ", ").replace("&", ",")
    counties = [re.sub(r"\s+", " ", item).strip(" ,") for item in county_text.split(",")]
    return ";".join(item for item in counties if item and len(item) < 40)


def phone_for(row: dict[str, str]) -> str:
    parts: list[str] = []
    if clean(row.get("phone_primary")):
        parts.append(clean(row.get("phone_primary")))
    if clean(row.get("phone_secondary")):
        parts.append(f"Secondary: {clean(row.get('phone_secondary'))}")
    if clean(row.get("text_contact")):
        parts.append(f"Text: {clean(row.get('text_contact'))}")
    return " | ".join(parts)


def service_area_type_for(row: dict[str, str]) -> str:
    area = clean(row.get("service_area")).lower()
    category = clean(row.get("category")).lower()
    if "statewide" in area:
        return "Statewide"
    if "national" in area:
        return "Remote / national"
    if any(term in category for term in ["statewide", "directory", "registry"]) and not clean(row.get("city")):
        return "Statewide"
    return "Local"


def is_remote(row: dict[str, str]) -> bool:
    text = text_for(row)
    return any(term in text for term in ["helpline", "directory", "registry", "resource navigator", "211", "vacancy locator", "warm line", "availability dashboard", "finder"])


def is_emergency(row: dict[str, str]) -> bool:
    text = f"{text_for(row)} {clean(row.get('availability_note')).lower()}"
    return any(term in text for term in ["24 hours", "24/7"]) and any(term in text for term in ["crisis", "bh link", "988", "gcal"])


def is_free_or_low_cost(row: dict[str, str]) -> bool:
    text = f"{text_for(row)} {clean(row.get('cost_notes')).lower()}"
    return any(term in text for term in ["free", "public funding", "publicly funded", "state-funded", "211", "helpline", "food bank", "legal aid", "resource directory", "nonprofit program"])


def hours_for(row: dict[str, str]) -> str:
    text = f"{clean(row.get('availability_note'))} {clean(row.get('services'))}".lower()
    if "24 hours a day, 7 days a week, 365 days a year" in text:
        return "24 hours a day, 7 days a week, 365 days a year"
    if "24 hours a day, 7 days a week" in text or "24/7" in text:
        return "24 hours a day, 7 days a week"
    return ""


def short_description_for(row: dict[str, str]) -> str:
    category = clean(row.get("category"))
    area = clean(row.get("service_area"))
    population = clean(row.get("population_served"))
    if area and population:
        value = f"{category} serving {population.lower()} in {area}."
    elif area:
        value = f"{category} serving {area}."
    else:
        value = f"{category} and community support resource."
    return value[:280]


def full_description_for(row: dict[str, str]) -> str:
    sections: list[str] = []
    if clean(row.get("services")):
        sections.append(clean(row.get("services")))
    if clean(row.get("certification_or_authority")):
        sections.append(f"Certification or authority: {clean(row.get('certification_or_authority'))}.")
    if clean(row.get("mat_notes")):
        sections.append(f"Medication policy: {clean(row.get('mat_notes'))}.")
    if clean(row.get("availability_note")):
        sections.append(f"Availability note: {clean(row.get('availability_note'))}")
    return "\n\n".join(sections)


def main() -> None:
    source_files = sorted(SOURCE_DIR.glob("*-source.csv"))
    if not source_files:
        raise FileNotFoundError(f"No source CSV files found in {SOURCE_DIR}")

    source_rows: list[dict[str, str]] = []
    for source_file in source_files:
        with source_file.open("r", newline="", encoding="utf-8") as handle:
            source_rows.extend(csv.DictReader(handle))

    used_slugs: set[str] = set()
    output_rows: list[dict[str, str]] = []

    for row in source_rows:
        state_name = clean(row.get("state"))
        if state_name not in STATE_ABBR:
            raise ValueError(f"Unsupported state in source data: {state_name}")

        name = clean(row.get("resource_name"))
        city = clean(row.get("city"))
        address = clean(row.get("address"))
        service_area = clean(row.get("service_area"))
        state = STATE_ABBR[state_name]

        base_slug = slugify("-".join([name, state, city]))
        slug = base_slug
        suffix = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        used_slugs.add(slug)

        eligibility = " ".join(unique([
            clean(row.get("population_served")),
            clean(row.get("eligibility_and_intake")),
        ]))
        mat_note = clean(row.get("mat_notes"))

        output_rows.append({
            "slug": slug,
            "name": name,
            "short_description": short_description_for(row),
            "full_description": full_description_for(row),
            "categories": categories_for(row),
            "services": services_for(row),
            "eligibility": eligibility,
            "location": address or service_area,
            "city": city,
            "state": state,
            "zip_code": extract_zip(address),
            "counties_served": counties_from(service_area),
            "service_area": service_area,
            "phone": phone_for(row),
            "website": clean(row.get("website")),
            "email": "",
            "hours": hours_for(row),
            "cost": clean(row.get("cost_notes")),
            "application_process": clean(row.get("eligibility_and_intake")),
            "documents_needed": "",
            "languages": "",
            "accessibility_notes": f"Medication policy information: {mat_note}" if mat_note else "",
            "verified_date": clean(row.get("last_verified")) or "",
            "featured": "false",
            "emergency": str(is_emergency(row)).lower(),
            "remote_services": str(is_remote(row)).lower(),
            "free_or_low_cost": str(is_free_or_low_cost(row)).lower(),
            "service_area_type": service_area_type_for(row),
            "is_demonstration": "false",
            "status": "published",
            "published": "true",
        })

    with OUTPUT_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"Created {OUTPUT_PATH.relative_to(ROOT)} with {len(output_rows)} resources from {len(source_files)} state files.")


if __name__ == "__main__":
    main()
