import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { formatTHB } from "@/utils/formatCurrency"

import type { PriceFilterValue } from "./homeTypes"

type HomeFiltersProps = {
  categories: string[]
  categoryCount: Record<string, number>
  selectedCategories: string[]
  priceFilter: PriceFilterValue
  onToggleCategory: (category: string) => void
  onPriceFilterChange: (value: PriceFilterValue) => void
  onClearFilters: () => void
  className?: string
  hideHeading?: boolean
}

export default function HomeFilters({
  categories,
  categoryCount,
  selectedCategories,
  priceFilter,
  onToggleCategory,
  onPriceFilterChange,
  onClearFilters,
  className,
  hideHeading = false,
}: HomeFiltersProps) {
  return (
    <aside
      className={cn(
        "self-start rounded-2xl border border-stone-200 bg-white p-4",
        className,
      )}
    >
      {!hideHeading && (
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Filter
        </p>
      )}

      <div className={hideHeading ? "border-t border-stone-200 pt-4" : "mt-4 border-t border-stone-200 pt-4"}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
          Category
        </p>
        <ul className="mt-3 space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm text-stone-700 transition hover:bg-stone-100">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => onToggleCategory(category)}
                    className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-0"
                  />
                  <span className="capitalize">{category}</span>
                </span>
                <span className="text-xs text-stone-400">
                  {categoryCount[category] ?? 0}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-stone-200 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">
          Price
        </p>
        <div className="mt-3 space-y-2 text-sm text-stone-700">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="price-filter"
              checked={priceFilter === "all"}
              onChange={() => onPriceFilterChange("all")}
              className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-0"
            />
            All prices
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="price-filter"
              checked={priceFilter === "under1500"}
              onChange={() => onPriceFilterChange("under1500")}
              className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-0"
            />
            Under {formatTHB(1500)}
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="price-filter"
              checked={priceFilter === "1500to2500"}
              onChange={() => onPriceFilterChange("1500to2500")}
              className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-0"
            />
            {formatTHB(1500)} - {formatTHB(2500)}
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="price-filter"
              checked={priceFilter === "over2500"}
              onChange={() => onPriceFilterChange("over2500")}
              className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-0"
            />
            Over {formatTHB(2500)}
          </label>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-5 w-full rounded-lg"
        onClick={onClearFilters}
      >
        Clear Filters
      </Button>
    </aside>
  )
}