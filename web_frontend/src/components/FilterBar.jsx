import Select from "./Select";
import Input from "./Input";

/**
 * PUBLIC_INTERFACE
 * FilterBar: Sorting and filtering controls
 */
export default function FilterBar({ sort, setSort, tag, setTag }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="new">Newest</option>
        <option value="popular">Most liked</option>
        <option value="alpha">Title A-Z</option>
      </Select>
      <Input label="Tag filter" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g., math" />
    </div>
  );
}
