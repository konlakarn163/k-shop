import {
  useEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { ArrowUpDown, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/utils/mockProducts";

import type { SortValue } from "./homeTypes";

type HomeProductCatalogProps = {
  searchQuery: string;
  sortOption: SortValue;
  pagedProducts: Product[];
  filteredProductsLength: number;
  totalPages: number;
  currentPage: number;
  listRef: RefObject<HTMLDivElement | null>;
  onSortChange: (value: SortValue) => void;
  onPageChange: (page: number) => void;
  onAddToCart: (product: Product) => void;
  mobileFilters: ReactNode;
};

export default function HomeProductCatalog({
  searchQuery,
  sortOption,
  pagedProducts,
  filteredProductsLength,
  totalPages,
  currentPage,
  listRef,
  onSortChange,
  onPageChange,
  onAddToCart,
  mobileFilters,
}: HomeProductCatalogProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (!isMobileFiltersOpen) {
      return undefined;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isMobileFiltersOpen]);

  useEffect(() => {
    if (!isMobileFiltersOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileFiltersOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileFiltersOpen]);

  const mobileFiltersModal =
    isMobileFiltersOpen &&
    createPortal(
      <>
        <button
          type="button"
          aria-label="Close filters"
          className="fixed inset-0 z-[100] bg-black/40"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
        <div className="fixed inset-4 z-[110] overflow-y-auto rounded-3xl border border-stone-200 bg-white p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between border-b border-stone-200 pb-3">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
              Filters
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {mobileFilters}
        </div>
      </>,
      document.body,
    );

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 border-b border-stone-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">
          Showing {pagedProducts.length} of {filteredProductsLength} products
          {searchQuery ? ` for "${searchQuery}"` : ""}
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1 items-center">
            <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Sort by
            </span>
            <Select
              modal={false}
              value={sortOption}
              onValueChange={(value: string) =>
                onSortChange(value as SortValue)
              }
            >
              <SelectTrigger className="w-36 gap-2 rounded-full border-stone-300 sm:w-44">
                <ArrowUpDown className="h-3.5 w-3.5 text-stone-500" />
                <SelectValue placeholder="Popularity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="priceLowHigh">Price: Low - High</SelectItem>
                <SelectItem value="priceHighLow">Price: High - Low</SelectItem>
                <SelectItem value="category">Category A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative lg:hidden">
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-stone-300 px-3"
                onClick={() => setIsMobileFiltersOpen((previous) => !previous)}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {mobileFiltersModal}

      <div ref={listRef} className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {pagedProducts.length > 0 ? (
          pagedProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={() => onAddToCart(item)}
            />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-stone-500">
            No products available.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "default" : "outline"}
                className="h-8 min-w-8 px-2"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ),
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
