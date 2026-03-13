import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import products from "../utils/mockProducts";
import { useCart } from "../hooks/useCart";
import { formatTHB } from "../utils/formatCurrency";
import SiteFooter from "../components/SiteFooter";
import { applyImageFallback, resolveImageSrc } from "../utils/resolveImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

gsap.registerPlugin(ScrollTrigger);

type SortValue = "" | "priceLowHigh" | "priceHighLow" | "category";
type PriceFilterValue = "all" | "under1500" | "1500to2500" | "over2500";

export default function HomePage() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [sortOption, setSortOption] = useState<SortValue>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilterValue>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const searchQuery = searchParams.get("search")?.toLowerCase().trim() || "";

  useEffect(() => {
    document.title = "K Shop | Home";
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-eyebrow", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(".hero-line", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });
      gsap.from(".hero-body", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5,
      });
      gsap.from(".hero-cta", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.7,
      });
      gsap.from(".hero-img-wrap", {
        scale: 1.04,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.1,
      });

      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      gsap.to(".hero-text-layer", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      if (listRef.current) {
        gsap.from(".product-card", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.06,
          immediateRender: false,
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 85%",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((item) => item.category)));
  }, []);

  const categoryCount = useMemo(() => {
    return categories.reduce<Record<string, number>>(
      (accumulator, category) => {
        accumulator[category] = products.filter(
          (item) => item.category === category,
        ).length;
        return accumulator;
      },
      {},
    );
  }, [categories]);

  const filteredProducts = useMemo(() => {
    let output = [...products];

    if (selectedCategories.length > 0) {
      output = output.filter((item) =>
        selectedCategories.includes(item.category),
      );
    }

    if (priceFilter === "under1500") {
      output = output.filter((item) => item.price < 1500);
    }
    if (priceFilter === "1500to2500") {
      output = output.filter(
        (item) => item.price >= 1500 && item.price <= 2500,
      );
    }
    if (priceFilter === "over2500") {
      output = output.filter((item) => item.price > 2500);
    }

    if (searchQuery) {
      output = output.filter((item) =>
        item.name.toLowerCase().includes(searchQuery),
      );
    }

    if (sortOption === "priceLowHigh") {
      output.sort((a, b) => a.price - b.price);
    }
    if (sortOption === "priceHighLow") {
      output.sort((a, b) => b.price - a.price);
    }
    if (sortOption === "category") {
      output.sort((a, b) => a.category.localeCompare(b.category));
    }

    return output;
  }, [priceFilter, searchQuery, selectedCategories, sortOption]);

  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const pagedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [priceFilter, searchQuery, selectedCategories, sortOption]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category],
    );
  };

  return (
    <div className="bg-white text-stone-800">
      <section
        ref={heroRef}
        className="relative h-screen overflow-hidden border-b border-stone-200 max-w-[1920px] mx-auto"
      >
        <div className="hero-img-wrap absolute top-1/2 right-8 w-[42%] -translate-y-1/2">
          <div ref={heroImgRef} className="h-[120%] w-full -translate-y-[10%]">
            <img
              src="/images/hero-fashion.jpg"
              onError={applyImageFallback}
              alt="K Shop fashion model"
              className="h-[78vh] w-full object-cover object-top rounded-tl-[80px] rounded-br-[80px]"
            />
          </div>
        </div>

        <div className="hero-eyebrow absolute inset-x-0 top-0 z-10 flex items-center justify-between px-8 pt-8 text-[10px] uppercase tracking-[0.28em] text-stone-500 sm:px-12 lg:px-16">
          <span>Contact</span>
          <span className="text-xs font-semibold tracking-[0.2em] text-stone-700">
            K Shop
          </span>
          <span className="hidden lg:block">
            Based in
            <br />
            Amsterdam, Netherlands
          </span>
        </div>

        <div className="hero-text-layer relative z-10 flex h-full w-full flex-col justify-center px-8 sm:px-12 lg:w-[56%] lg:px-16">
          <h1 className="font-serif leading-[0.88] tracking-tight text-stone-900">
            <span className="hero-line block text-[clamp(2.8rem,7vw,6rem)]">
              Redefining
            </span>
            <span className="hero-line block text-[clamp(2.8rem,7vw,6rem)] text-amber-500">
              Your
            </span>
            <span className="hero-line block text-[clamp(2.8rem,7vw,6rem)]">
              Everyday
            </span>
            <span className="hero-line block text-[clamp(2.8rem,7vw,6rem)]">
              Elegance.
            </span>
          </h1>

          <p className="hero-body mt-7 max-w-[340px] text-[11px] leading-relaxed text-stone-500">
            True elegance shouldn't feel out of reach. We are redefining the
            modern wardrobe by offering a wide array of luxury clothing that
            balances prestige with practicality. Featuring our signature
            figure-flattering silhouettes, our pieces are engineered to make you
            feel flawless at any event—even if that event is just a typical day
            in the city.
          </p>

          <Link
            to="/"
            className="hero-cta mt-7 inline-flex self-start rounded-full border border-stone-300 px-5 py-2 text-[10px] uppercase tracking-[0.28em] text-stone-700 transition hover:border-stone-500"
          >
            View Lookbook
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-7 py-10 sm:px-12 lg:px-16">
        <p className="text-center text-[10px] uppercase tracking-[0.45em] text-stone-400">
          Latest Collection
        </p>
        <h2 className="mt-2 text-center font-serif text-4xl italic text-stone-800 sm:text-5xl">
          Spring — Summer <span className="text-amber-500">This Year</span>
        </h2>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[250px,1fr]">
          <aside className="self-start rounded-2xl border border-stone-200 bg-white p-4 lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
              Filter
            </p>

            <div className="mt-4 border-t border-stone-200 pt-4">
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
                          onChange={() => toggleCategory(category)}
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
                    onChange={() => setPriceFilter("all")}
                    className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-0"
                  />
                  All prices
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price-filter"
                    checked={priceFilter === "under1500"}
                    onChange={() => setPriceFilter("under1500")}
                    className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-0"
                  />
                  Under {formatTHB(1500)}
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price-filter"
                    checked={priceFilter === "1500to2500"}
                    onChange={() => setPriceFilter("1500to2500")}
                    className="h-4 w-4 border-stone-300 text-stone-900 focus:ring-0"
                  />
                  {formatTHB(1500)} - {formatTHB(2500)}
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="price-filter"
                    checked={priceFilter === "over2500"}
                    onChange={() => setPriceFilter("over2500")}
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
              onClick={() => {
                setSelectedCategories([]);
                setPriceFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </aside>

          <div>
            <div className="mb-5 flex flex-col gap-3 border-b border-stone-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone-600">
                Showing {pagedProducts.length} of {filteredProducts.length}{" "}
                products
                {searchQuery ? ` for \"${searchQuery}\"` : ""}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Sort by
                </span>
                <Select
                  modal={false}
                  value={sortOption}
                  onValueChange={(value) =>
                    value !== null && setSortOption(value as SortValue)
                  }
                >
                  <SelectTrigger className="w-44 gap-2 rounded-full border-stone-300">
                    <ArrowUpDown className="h-3.5 w-3.5 text-stone-500" />
                    <SelectValue placeholder="Popularity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Popularity</SelectItem>
                    <SelectItem value="priceLowHigh">
                      Price: Low → High
                    </SelectItem>
                    <SelectItem value="priceHighLow">
                      Price: High → Low
                    </SelectItem>
                    <SelectItem value="category">Category A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div
              ref={listRef}
              className="grid grid-cols-2 gap-4 md:grid-cols-3"
            >
              {pagedProducts.length > 0 ? (
                pagedProducts.map((item) => {
                  const isSale = item.id % 3 === 0;
                  const comparePrice = Math.round(item.price * 1.25);

                  return (
                    <Card
                      key={item.id}
                      className="product-card group flex h-full min-h-[360px] flex-col overflow-hidden border-0 p-0 shadow-none transition hover:shadow-md"
                    >
                      <Link to={`/product/${item.id}`} className="block">
                        <div className="relative bg-stone-200">
                          {isSale && (
                            <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                              Sale
                            </span>
                          )}
                          <img
                            src={resolveImageSrc(item.imageOne)}
                            alt={item.name}
                            onError={applyImageFallback}
                            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>

                      <div className="flex flex-1 flex-col space-y-1 px-2 py-3">
                        <h3 className="truncate text-sm font-medium text-stone-800">
                          {item.name}
                        </h3>
                        <div className="mt-auto flex items-end justify-between gap-2">
                          <div>
                            <p className="text-xs text-stone-400">
                              {2 + (item.id % 7)} Colors
                            </p>
                          </div>
                          <div className="text-right">
                            {isSale && (
                              <p className="text-xs text-stone-400 line-through">
                                {formatTHB(comparePrice)}
                              </p>
                            )}
                            <p className="text-lg font-semibold leading-none text-stone-900">
                              {formatTHB(item.price)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex justify-end px-2 pb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-md px-4 text-[11px] uppercase tracking-[0.18em]"
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              name: item.name,
                              quantity: 1,
                              price: item.price,
                              image: item.imageOne,
                              stock: item.quantity,
                            })
                          }
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </Card>
                  );
                })
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
                  onClick={() =>
                    setCurrentPage((previous) => Math.max(1, previous - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={page === currentPage ? "default" : "outline"}
                    className="h-8 min-w-8 px-2"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((previous) =>
                      Math.min(totalPages, previous + 1),
                    )
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
