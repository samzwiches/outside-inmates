import { resourceCategoryOptions, stateOptions } from "../../data/resources";
import type { ResourceSearchFilters } from "../../lib/resource-search";

type ResourceSearchPanelProps = { initial?: Partial<ResourceSearchFilters>; className?: string };

export function ResourceSearchPanel({ initial = {}, className = "" }: ResourceSearchPanelProps) {
  return (
    <form className={`directory-search-panel ${className}`} action="/resources/results" method="get">
      <div className="search-field search-location-field">
        <label htmlFor="directory-location">ZIP code or city</label>
        <input id="directory-location" name="location" defaultValue={initial.location ?? ""} placeholder="e.g., 41011 or Covington" />
      </div>
      <div className="search-field">
        <label htmlFor="directory-state">State</label>
        <select id="directory-state" name="state" defaultValue={initial.state ?? ""}>
          {stateOptions.map((state) => <option key={state.value} value={state.value}>{state.label}</option>)}
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="directory-category">Category</label>
        <select id="directory-category" name="category" defaultValue={initial.categories?.[0] ?? ""}>
          <option value="">Any need</option>
          {resourceCategoryOptions.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
        </select>
      </div>
      <div className="search-field search-keyword-field">
        <label htmlFor="directory-query">Keyword</label>
        <input id="directory-query" name="query" defaultValue={initial.query ?? ""} placeholder="e.g., identification" />
      </div>
      <button className="button button-primary directory-search-button" type="submit">Search resources <span aria-hidden="true">→</span></button>
    </form>
  );
}
