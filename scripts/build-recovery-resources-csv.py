#!/usr/bin/env python3
"""Build the Supabase resources import CSV from the four state source files."""

from __future__ import annotations

import csv
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "data" / "resources" / "recovery"
OUTPUT_PATH = SOURCE_DIR / "outside_inmates_resources_supabase_import.csv"

SOURCE_FILES = [
    SOURCE_DIR / "ohio-source.csv",
    SOURCE_DIR / "kentucky-source.csv",
    SOURCE_DIR / "indiana-source.csv",
    SOURCE_DIR / "west-virginia-source.csv",
]

STATE_ABBR = {
    "Ohio": "OH",
    "Kentucky": "KY",
    "Indiana": "IN",
    "West Virginia": "WV",
}

OUTPUT_COLUMNS = [
    "slug",
    "name",
    "short_description",
    "full_description",
    "categories",
    "services",
    "eligibility",
    "location",
    "city",
    "state",
    "zip_code",
    "counties_served",
    "service_area",
    "phone",
    "website",
    "email",
    "hours",
    "cost",
    "application_process",
    "documents_needed",
    "languages",
    "accessibility_notes",
    "verified_date",
    "featured",
    "emergency",
    "remote_services",
    "free_or_low_cost",
    "service_area_type",
    "is_demonstration",
    "status",
    "published",
]


def clean(value: str | None) -> str:
    return (value or "").strip()


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-zA-Z0-9]+", "-", ascii_value.lower()).strip("-")


def unique_parts(values: list[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        value = clean(value)
        key = value.lower()
        if value and key not in seen:
            result.append(value)
            seen.add(key)
    return result


def categories_for(row: dict[str, str]) -> str:
    text = " ".join(
        [
            clean(row.get("resource_name")),
            clean(row.get("category")),
            clean(row.get("services")),
            clean(row.get("population_served")),
        ]
    ).lower()

    categories: list[str] = []

    if any(term in text for term in [
        "housing", "house", "sober living", "residence", "residential",
        "halfway", "transitional living", "shelter",
    ]):
        categories.append("Housing")

    if any(term in text for term in [
        "recovery", "substance use", "addiction", "sober", "oxford house",
        "detox", "medication for addiction",
    ]):
        categories.append("Substance Use Recovery")

    if any(term in text for term in [
        "reentry", "justice involved", "corrections", "parole", "probation",
        "formerly incarcerated", "community transition", "halfway",
    ]):
        categories.append("Reentry Planning")

    if any(term in text for term in [
        "mental health", "behavioral health", "counseling", "crisis",
    ]):
        categories.append("Mental Health")

    if any(term in text for term in [
        "family", "families", "women and children", "parents", "children",
    ]):
        categories.append("Family Support")

    if any(term in text for term in [
        "employment", "job", "workforce", "training", "career",
    ]):
        categories.append("Employment")

    if "transportation" in text:
        categories.append("Transportation")

    if not categories:
        categories.append("Substance Use Recovery")

    return ";".join(unique_parts(categories))


def services_for(row: dict[str, str]) -> str:
    category = clean(row.get("category")).lower()
    text = " ".join(
        [clean(row.get("resource_name")), category, clean(row.get("services"))]
    ).lower()
    labels: list[str] = []

    if "helpline" in category or "call center" in text:
        labels += ["Helpline", "Treatment referrals", "Recovery support"]
    if "resource navigator" in category or "211" in text:
        labels += ["Resource navigation", "Housing referrals", "Community referrals"]
    if "directory" in category or "registry" in category or "locator" in text:
        labels += ["Resource directory", "Housing search", "Provider contacts"]
    if "oxford house" in text:
        labels += ["Oxford House", "Sober living", "Peer supported recovery housing"]
    if any(term in text for term in ["halfway", "reentry", "justice involved", "corrections"]):
        labels += ["Residential reentry", "Case management", "Community transition"]
    if any(term in text for term in ["recovery housing", "sober living", "recovery residence"]):
        labels += ["Recovery housing", "Peer support", "Recovery accountability"]
    if any(term in text for term in ["residential recovery", "residential treatment", "detox"]):
        labels += ["Residential recovery", "Life skills", "Peer support"]
    if "mental health" in text or "behavioral health" in text:
        labels.append("Mental health support")
    if any(term in text for term in ["employment", "jobs and hope", "workforce"]):
        labels.append("Employment support")
    if "family" in text or "parents" in text:
        labels.append("Family support")

    if not labels:
        labels.append(clean(row.get("category")) or "Recovery support")

    return ";".join(unique_parts(labels))


def extract_zip(address: str) -> str:
    match = re.search(r"\b(\d{5})(?:-\d{4})?\b", clean(address))
    return match.group(1) if match else ""


def counties_from(service_area: str) -> str:
    match = re.search(r"(.+?)\s+Count(?:y|ies)\b", clean(service_area), re.I)
    if not match:
        return ""
    value = match.group(1).replace(" and ", ", ").replace("&", ",")
    counties = [re.sub(r"\s+", " ", item).strip(" ,") for item in value.split(",")]
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
    text = " ".join([clean(row.get("resource_name")), clean(row.get("category"))]).lower()
    return any(term in text for term in [
        "helpline", "directory", "registry", "resource navigator", "211",
        "vacancy locator", "call center",
    ])


def is_emergency(row: dict[str, str]) -> bool:
    text = " ".join(
        [clean(row.get("resource_name")), clean(row.get("category")), clean(row.get("availability_note"))]
    ).lower()
    return any(term in text for term in ["24 hours", "24/7", "crisis"]) and any(
        term in text for term in ["helpline", "careline", "help4wv", "immediate"]
    )


def is_free_or_low_cost(row: dict[str, str]) -> bool:
    text = " ".join(
        [clean(row.get("category")), clean(row.get("cost_notes")), clean(row.get("services"))]
    ).lower()
    return any(term in text for term in [
        "no cost", "free confidential", "211", "helpline", "directory",
        "registry", "locator", "resource navigator",
    ])


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
        value = f"{category} and recovery support resource."
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
    source_rows: list[dict[str, str]] = []
    for source_file in SOURCE_FILES:
        if not source_file.exists():
            raise FileNotFoundError(f"Missing source file: {source_file}")
        with source_file.open("r", newline="", encoding="utf-8") as handle:
            source_rows.extend(csv.DictReader(handle))

    used_slugs: set[str] = set()
    output_rows: list[dict[str, str]] = []

    for row in source_rows:
        name = clean(row.get("resource_name"))
        state = STATE_ABBR[clean(row.get("state"))]
        city = clean(row.get("city"))
        address = clean(row.get("address"))
        service_area = clean(row.get("service_area"))

        slug_parts = [name, state]
        if city and city.lower() not in name.lower():
            slug_parts.append(city)
        base_slug = slugify("-".join(slug_parts))
        slug = base_slug
        suffix = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        used_slugs.add(slug)

        eligibility = " ".join(
            unique_parts([clean(row.get("population_served")), clean(row.get("eligibility_and_intake"))])
        )
        mat_note = clean(row.get("mat_notes"))

        output_rows.append(
            {
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
                "verified_date": clean(row.get("last_verified")) or "2026-08-02",
                "featured": "false",
                "emergency": str(is_emergency(row)).lower(),
                "remote_services": str(is_remote(row)).lower(),
                "free_or_low_cost": str(is_free_or_low_cost(row)).lower(),
                "service_area_type": service_area_type_for(row),
                "is_demonstration": "false",
                "status": "published",
                "published": "true",
            }
        )

    with OUTPUT_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"Created {OUTPUT_PATH.relative_to(ROOT)} with {len(output_rows)} resources.")


if __name__ == "__main__":
    main()
