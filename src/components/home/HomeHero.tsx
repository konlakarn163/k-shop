import type { RefObject } from "react"
import { Link } from "react-router-dom"

import CircleBadge from "@/components/home/CircleBadge"
import { applyImageFallback } from "@/utils/resolveImage"

type HomeHeroProps = {
  heroRef: RefObject<HTMLDivElement | null>
  heroImgRef: RefObject<HTMLDivElement | null>
}

export default function HomeHero({ heroRef, heroImgRef }: HomeHeroProps) {
  return (
    <section
      ref={heroRef}
      className="sticky top-0 z-0 h-screen max-w-[1920px] overflow-hidden border-b border-stone-200 px-10"
    >
      <CircleBadge
        className="absolute top-20 right-6 sm:bottom-8 sm:right-2 lg:bottom-10 lg:right-[4%]"
      />

      <div className="hero-img-wrap absolute top-[45%] md:top-1/2 right-8 w-[80%] md:w-[42%] md:-translate-y-1/2 px-8 sm:px-12 lg:px-16">
        <div ref={heroImgRef} className="h-[120%] lg:h-[120%] w-full">
          <img
            src="/images/hero-fashion.jpg"
            onError={applyImageFallback}
            alt="K Shop fashion model"
            loading="eager"
            className="h-[40vh] md:h-[72vh] w-full object-cover object-top rounded-tl-[80px] rounded-br-[80px]"
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
          Bangkok, Thailand
        </span>
      </div>

      <div className="hero-text-layer relative z-10 flex h-full w-full flex-col pt-24 md:justify-center px-8 sm:px-12 lg:w-[56%] lg:px-24">
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
          feel flawless at any event-even if that event is just a typical day
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
  )
}