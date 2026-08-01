# Media attribution registry

All image metadata is also structured in `app/data/media.ts`, which is the source of truth for rendering and future editing. This file makes the approved third-party photography easy to audit before media persistence is connected.

| Media key | Local filename | Photographer | Source | Original page | License | Usage note |
| --- | --- | --- | --- | --- | --- | --- |
| `home.hero` | `public/media/home-hero-doorway.jpg` | Alexander Mass | Unsplash | [Open doorway leading to a sunny backyard view outside](https://unsplash.com/photos/open-doorway-leading-to-a-sunny-backyard-view-outside-LFPln5RB9vQ) | Unsplash License | Keep the open doorway in view. |
| `resources.hero` | `public/media/resources-hero-documents.jpg` | Olena Kholina | Unsplash | [Two people reviewing documents at a table](https://unsplash.com/photos/two-people-reviewing-documents-at-a-table-MhqUBTxQ3Hw) | Unsplash License | Crop toward hands, papers, and shared problem solving. |
| `families.hero` | `public/media/families-hero-table.jpg` | olia danilevich | Pexels | [A family sitting at the table](https://www.pexels.com/photo/a-family-sitting-at-the-table-8525004/) | Pexels License | Stock image posed by models; do not imply lived experience with incarceration. |
| `ask-for-help.hero` | `public/media/ask-for-help-hero-writing.jpg` | Monica Melton | Unsplash | [Woman writing on table](https://unsplash.com/photos/woman-writing-on-table-oc_XTqWezp4) | Unsplash License | Emphasize assistance and collaboration; make no claims about people shown. |

No Unsplash+ imagery is approved for this project. Attribution is retained even where the platform does not require a visible credit.
