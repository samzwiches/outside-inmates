# Recovery and reentry resources

This folder contains maintained research for recovery housing, private sober living, halfway houses, reentry, legal help, identification, housing, employment, food, crisis support, helplines, medical detox, medication support, IOP, PHP, outpatient treatment, hospital-based addiction care, and residential treatment.

## Live database coverage

As of 2026-08-09, the live Outside Inmates resource database contains **1,000 published resources across 40 states and the District of Columbia where applicable in the coverage list below**.

Current covered jurisdictions:

* Alabama
* Alaska
* Arizona
* Arkansas
* California
* Colorado
* Connecticut
* District of Columbia
* Delaware
* Florida
* Georgia
* Hawaii
* Idaho
* Illinois
* Indiana
* Iowa
* Kansas
* Kentucky
* Louisiana
* Maine
* Maryland
* Massachusetts
* Michigan
* Mississippi
* Missouri
* New Hampshire
* New Jersey
* New York
* North Carolina
* Ohio
* Oklahoma
* Pennsylvania
* Rhode Island
* South Carolina
* Tennessee
* Texas
* Vermont
* Virginia
* West Virginia
* Wisconsin

The `*-source.csv` files are the recoverable research corpus behind the directory and continue to expand as states are audited. `ohio.csv` is the original Supabase-formatted Ohio import from the first upload pass. Supabase remains the live published data source used by the site.

## Expanded audit standard

Beginning with the 2026-08-09 audit, an existing state is not considered fully reviewed just because it has a general treatment directory or a few recovery homes. Research passes now intentionally scan for the following service types:

* Medical detox and withdrawal management
* Residential substance use treatment
* Partial hospitalization programs (PHP)
* Intensive outpatient programs (IOP)
* Standard outpatient treatment
* Medication for addiction treatment / MAT / MOUD
* Hospital and academic medical-center addiction programs
* Publicly funded treatment systems and access lines
* Private treatment providers
* Certified recovery residences and sober living
* Oxford Houses
* Halfway houses and corrections-linked transitional housing
* Women-only treatment and housing
* Programs for pregnant and parenting women
* Programs allowing women to live with children during treatment
* Reentry-specific housing and treatment
* Programs where clients live in separate recovery housing and travel to a clinical site for PHP, IOP, classes, groups, or medication services

The 2026-08-09 re-audit of the 40 covered states added 41 previously missing resources and strengthened several existing listings. After that pass, every covered state had at least one published result tagged for IOP, PHP, medication support, hospital or medical-system addiction care, recovery/transitional housing, and women-focused services. This is a coverage check, not a claim that every program in each category has been identified.

## Verification rules

Prefer official provider pages, state and federal agency sources, health-system pages, recognized recovery-residence certifiers, and current accreditation records. Do not treat a third-party directory as proof that a program is open when a primary source is available.

For housing and treatment programs, confirm or clearly flag details that change quickly, especially:

* Current openings or bed availability
* Fees and insurance participation
* Medicaid acceptance
* Medication and MOUD policies
* Gender and family eligibility
* Court, probation, parole, or DOC referral requirements
* Whether housing is available independently or only while enrolled in treatment
* Whether a PHP or IOP is substance-use-specific or a broader co-occurring behavioral-health program

## Build the Supabase import

From the repository root, run:

```bash
python scripts/build-recovery-resources-csv.py
```

The builder automatically reads every `*-source.csv` file and creates:

```text
data/resources/recovery/outside_inmates_resources_supabase_import.csv
```

The generated headers match the existing Supabase `resources` table used by the site. It sets `is_demonstration` to false, `status` to published, and `published` to true. Treatment levels such as partial hospitalization, intensive outpatient, standard outpatient, medication support, recovery housing, and residential recovery are preserved as service labels. North Carolina SACOT and SAIOP terminology is normalized into the matching PHP and IOP service labels.

## Publish to the live site

1. Run the builder when publishing source-file changes in bulk.
2. Import the generated CSV into the Supabase `resources` table or safely upsert reviewed records directly.
3. Confirm imported or updated rows before considering the pass complete.
4. The live site reads published non-demonstration records directly from Supabase.
5. Code and source data committed to `main` flow through the configured site hosting project.

The site keeps GitHub as the recoverable research source and Supabase as the live database. This prevents two competing live data copies.

## Updating a resource

Edit the appropriate state source file or add a documented audit source, update `last_verified`, run the builder when appropriate, and update or reimport the corresponding Supabase records. Confirm live openings, fees, insurance, medication policies, house phone numbers, and current level of care before presenting them as currently available.

Do not commit Supabase service keys, private environment variables, or user data.
