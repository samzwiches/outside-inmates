import { resourceCategoryOptions, stateOptions } from "../../data/resources";
import type { ResourceSearchFilters } from "../../lib/resource-search";

export function ResourceFilters({ filters }: { filters: ResourceSearchFilters }) {
  return (
    <aside className="resource-filters" aria-label="Resource filters">
      <details open>
        <summary>Filters and sort</summary>
        <form action="/resources/results" method="get">
          <input type="hidden" name="location" value={filters.location} />
          <input type="hidden" name="query" value={filters.query} />
          <fieldset>
            <legend>Category</legend>
            <div className="filter-check-list">
              {resourceCategoryOptions.map((category) => <label key={category.slug}><input type="checkbox" name="category" value={category.slug} defaultChecked={filters.categories.includes(category.slug)} /> <span>{category.name}</span></label>)}
            </div>
          </fieldset>
          <fieldset>
            <legend>State</legend>
            <select name="state" defaultValue={filters.state}>{stateOptions.map((state) => <option key={state.value} value={state.value}>{state.label}</option>)}</select>
          </fieldset>
          <fieldset>
            <legend>Service area</legend>
            <select name="serviceArea" defaultValue={filters.serviceArea}>
              <option value="">Any service area</option><option value="Local">Local, in-person</option><option value="Statewide">Statewide</option><option value="Remote / national">Remote or national</option>
            </select>
          </fieldset>
          <fieldset>
            <legend>Helpful options</legend>
            <div className="filter-check-list">
              <label><input type="checkbox" name="free" value="true" defaultChecked={filters.freeOrLowCost} /> <span>Free or low-cost</span></label>
              <label><input type="checkbox" name="remote" value="true" defaultChecked={filters.remoteServices} /> <span>Remote services</span></label>
              <label><input type="checkbox" name="emergency" value="true" defaultChecked={filters.emergency} /> <span>Urgent support listings</span></label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Sort by</legend>
            <select name="sort" defaultValue={filters.sort}><option value="featured">Featured first</option><option value="reviewed">Most recently reviewed</option><option value="name">Name A–Z</option></select>
          </fieldset>
          <button className="button button-primary filter-submit" type="submit">Apply filters</button>
          <a className="clear-filters" href="/resources/results">Clear filters</a>
        </form>
      </details>
    </aside>
  );
}
