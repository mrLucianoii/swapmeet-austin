import type { Category } from "../types";

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const pillBase =
  "rounded-pill border-[length:var(--hairline)] border-solid px-token-4 py-token-2 text-label uppercase transition-[filter] hover:brightness-105";

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-token-2" role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`${pillBase} ${
          selected === null ? "border-primary bg-primary text-on-primary" : "border-line bg-panel text-fg"
        }`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`${pillBase} ${
            selected === category.id ? "border-primary bg-primary text-on-primary" : "border-line bg-panel text-fg"
          }`}
          onClick={() => onSelect(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
