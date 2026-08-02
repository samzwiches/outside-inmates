# Recovery and reentry resources

This folder contains the verified recovery housing, sober living, halfway house, reentry, helpline, and treatment referral research for Ohio, Kentucky, Indiana, and West Virginia.

## Source files

The maintainable source files are:

* `ohio-source.csv`
* `kentucky-source.csv`
* `indiana-source.csv`
* `west-virginia-source.csv`

Together they contain 91 resources verified on 2026-08-02.

`ohio.csv` is the original Supabase formatted Ohio import created during the first upload pass. The four `*-source.csv` files are the canonical research source going forward.

## Build the Supabase import

From the repository root, run:

```bash
python scripts/build-recovery-resources-csv.py
```

This creates:

```text
data/resources/recovery/outside_inmates_resources_supabase_import.csv
```

The generated headers match the existing Supabase `resources` table used by the site.

## Publish to the live site

1. Run the builder.
2. Import the generated CSV into the Supabase `resources` table.
3. Confirm imported records have `published = true` and `status = published`.
4. The live site reads published records directly from Supabase, so database-only updates do not require a code redeploy.
5. Code and source-data changes committed to `main` flow through the configured OpenAI Sites hosting project.

The site intentionally keeps GitHub as the recoverable source and Supabase as the live database. This prevents the application from carrying two competing data copies.

## Updating a resource

Edit the appropriate state source file, update `last_verified`, run the builder again, and reimport or update the corresponding Supabase record. Confirm live openings and house-level phone numbers before presenting them as currently available.

Do not commit Supabase service keys, private environment variables, or user data.
