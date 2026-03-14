import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import products from "../utils/mockProducts";
import { useCart } from "../hooks/useCart";
import SiteFooter from "../components/SiteFooter";
import HomeCollectionHeading from "@/components/home/HomeCollectionHeading";
import HomeFilters from "@/components/home/HomeFilters";
import HomeHero from "@/components/home/HomeHero";
import HomeProductCatalog from "@/components/home/HomeProductCatalog";
import {
  type PriceFilterValue,
  type SortValue,
} from "@/components/home/homeTypes";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [sortOption, setSortOption] = useState<SortValue>("popularity");
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
          yPercent: -15,
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
        yPercent: 10,
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
      <HomeHero heroRef={heroRef} heroImgRef={heroImgRef} />

      <div className="relative z-10 bg-white">
        <HomeCollectionHeading />

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[250px,1fr]">
            <div className="hidden lg:block">
              <HomeFilters
                categories={categories}
                categoryCount={categoryCount}
                selectedCategories={selectedCategories}
                priceFilter={priceFilter}
                onToggleCategory={toggleCategory}
                onPriceFilterChange={setPriceFilter}
                onClearFilters={() => {
                  setSelectedCategories([]);
                  setPriceFilter("all");
                }}
                className="lg:sticky lg:top-24"
              />
            </div>

            <HomeProductCatalog
              searchQuery={searchQuery}
              sortOption={sortOption}
              pagedProducts={pagedProducts}
              filteredProductsLength={filteredProducts.length}
              totalPages={totalPages}
              currentPage={currentPage}
              listRef={listRef}
              onSortChange={setSortOption}
              onPageChange={setCurrentPage}
              onAddToCart={(item) =>
                addToCart({
                  id: item.id,
                  name: item.name,
                  quantity: 1,
                  price: item.price,
                  image: item.imageOne,
                  stock: item.quantity,
                })
              }
              mobileFilters={
                <HomeFilters
                  categories={categories}
                  categoryCount={categoryCount}
                  selectedCategories={selectedCategories}
                  priceFilter={priceFilter}
                  onToggleCategory={toggleCategory}
                  onPriceFilterChange={setPriceFilter}
                  onClearFilters={() => {
                    setSelectedCategories([]);
                    setPriceFilter("all");
                  }}
                  className="border-0 p-0"
                  hideHeading
                />
              }
            />
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
