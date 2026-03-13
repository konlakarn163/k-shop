import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, Search, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import gsap from "gsap";
import products from "../utils/mockProducts";
import { useCart } from "../hooks/useCart";
import { formatTHB } from "../utils/formatCurrency";
import SiteFooter from "../components/SiteFooter";
import { applyImageFallback, resolveImageSrc } from "../utils/resolveImage";

type SortValue = "" | "priceLowHigh" | "priceHighLow" | "category";

const heroSlides = [
  {
    id: 1,
    title: "Spring-Summer Edit",
    subtitle: "New silhouettes for city and resort days",
    cta: "Shop New Arrivals",
    to: "/",
    classes: "bg-white",
  },
  {
    id: 2,
    title: "Tailored Essentials",
    subtitle: "Refined pieces made for everyday elegance",
    cta: "Explore Collection",
    to: "/",
    classes: "bg-white",
  },
  {
    id: 3,
    title: "Accessories Story",
    subtitle: "Bags and shoes crafted for standout looks",
    cta: "Discover Accessories",
    to: "/",
    classes: "bg-white",
  },
];

export default function HomePage() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [sortOption, setSortOption] = useState<SortValue>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const heroRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const searchQuery = searchParams.get("search")?.toLowerCase().trim() || "";

  useEffect(() => {
    document.title = "K Shop | Home";
  }, []);

  useLayoutEffect(() => {
    if (!heroRef.current || !listRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".hero-content", {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
      });

      gsap.from(".product-card", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.2,
      });
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(products.map((item) => item.category)))];
  }, []);

  const filteredProducts = useMemo(() => {
    let output = [...products];

    if (categoryFilter !== "all") {
      output = output.filter((item) => item.category === categoryFilter);
    }

    if (searchQuery) {
      output = output.filter((item) =>
        item.name.toLowerCase().includes(searchQuery)
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
  }, [categoryFilter, searchQuery, sortOption]);

  return (
    <div className="bg-white text-stone-800">
      <section ref={heroRef} className="border-b border-stone-200">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4800, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          className="fashion-swiper"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className={`mx-auto flex h-[440px] max-w-7xl items-center px-5 sm:px-8 lg:px-10 ${slide.classes}`}
              >
                <div className="max-w-xl space-y-5">
                  <p className="hero-content text-xs uppercase tracking-[0.35em] text-stone-500">
                    K Shop
                  </p>
                  <h1 className="hero-content text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl">
                    {slide.title}
                  </h1>
                  <p className="hero-content text-base text-stone-600 sm:text-lg">
                    {slide.subtitle}
                  </p>
                  <Link
                    to={slide.to}
                    className="hero-content inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-stone-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Curated Drop
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-stone-900">Fashion Collection</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-600">
              <Filter className="h-4 w-4" />
              <span className="uppercase tracking-wider">Category</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="bg-transparent text-sm text-stone-900 outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-600">
              <Search className="h-4 w-4" />
              <span className="uppercase tracking-wider">Sort</span>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortValue)}
                className="bg-transparent text-sm text-stone-900 outline-none"
              >
                <option value="">none</option>
                <option value="priceLowHigh">price low-high</option>
                <option value="priceHighLow">price high-low</option>
                <option value="category">category a-z</option>
              </select>
            </label>
          </div>
        </div>

        <div ref={listRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <article
                key={item.id}
                className="product-card group rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/product/${item.id}`}>
                  <div className="overflow-hidden rounded-xl bg-white">
                    <img
                      src={resolveImageSrc(item.imageOne)}
                      alt={item.name}
                      onError={applyImageFallback}
                      className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 space-y-1">
                    <h3 className="truncate text-sm font-semibold text-stone-900 sm:text-base">
                      {item.name}
                    </h3>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      {item.category}
                    </p>
                    <p className="text-sm font-semibold text-stone-900 sm:text-base">
                      {formatTHB(item.price)}
                    </p>
                  </div>
                </Link>

                <button
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
                  className="mt-3 w-full rounded-xl border border-stone-900 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-900 transition hover:bg-stone-900 hover:text-white"
                >
                  Add to Cart
                </button>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-stone-500">
              No products available.
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
