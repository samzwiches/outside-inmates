# Recovery and reentry resources

This folder contains maintained research for recovery housing, private sober living, halfway houses, reentry, legal help, identification, housing, employment, food, crisis support, helplines, IOP, PHP, outpatient treatment, and residential treatment.

## Current state coverage

* Delaware
* Indiana
* Kentucky
* Maine
* Massachusetts
* New Hampshire
* New York
* Ohio
* Pennsylvania
* Rhode Island
* Vermont
* West Virginia

The twelve `*-source.csv` files contain 304 resources. The first four states were verified on 2026-08-02. The remaining eight states were verified on 2026-08-03.

`ohio.csv` is the original Supabase formatted Ohio import created during the first upload pass. The `*-source.csv` files are the canonical research source going forward.

## Build the Supabase import

From the repository root, run:

```bash
python scripts/build-recovery-resources-csv.py
```

The builder automatically reads every `*-source.csv` file and creates:

```text
data/resources/recovery/outside_inmates_resources_supabase_import.csv
```

The generated headers match the existing Supabase `resources` table used by the site. It sets `is_demonstration` to false, `status` to published, and `published` to true. Treatment levels such as partial hospitalization, intensive outpatient, standard outpatient, medication support, recovery housing, and residential recovery are preserved as service labels.

## Publish to the live site

1. Run the builder.
2. Import the generated CSV into the Supabase `resources` table.
3. Confirm the imported rows before completing the import.
4. The live site reads published non demonstration records directly from Supabase.
5. Code and source data committed to `main` flow through the configured OpenAI Sites hosting project.

The site keeps GitHub as the recoverable source and Supabase as the live database. This prevents two competing live data copies.

## Updating a resource

Edit the appropriate state source file, update `last_verified`, run the builder again, and update or reimport the corresponding Supabase records. Confirm live openings, fees, insurance, medication policies, and house phone numbers before presenting them as currently available.

Do not commit Supabase service keys, private environment variables, or user data.
