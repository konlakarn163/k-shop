import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Handbag } from "lucide-react";

import { cn } from "@/lib/utils";

type CircleBadgeProps = {
  className?: string;
  text?: string;
};

export default function CircleBadge({
  className,
  text = " SHOPPING — FASHIONS — LIFESTYLE — ",
}: CircleBadgeProps) {
  const badgeWrapperRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgeWrapperRef.current,
        {
          autoAlpha: 0,
          scale: 0.9,
          y: 24,
        },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        },
      );

      gsap.to(badgeRef.current, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none",
      });
    }, badgeWrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={badgeWrapperRef}
      className={cn("pointer-events-none absolute z-20 opacity-0", className)}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.1)] md:h-28 md:w-28" />

        <div ref={badgeRef} className="relative h-20 w-20 md:h-40 md:w-40">
          <svg viewBox="0 0 100 100" className="h-full w-full fill-amber-500">
            <path
              id="circlePath"
              d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              fill="transparent"
            />
            <text className="text-[9px] font-black uppercase tracking-[1.8px]">
              <textPath xlinkHref="#circlePath">{text}</textPath>
            </text>
          </svg>
        </div>

        <div className="absolute flex flex-col items-center justify-center">
          <Handbag className="mb-1 text-[30px] font-black leading-none text-amber-500" />
        </div>
      </div>
    </div>
  );
}
