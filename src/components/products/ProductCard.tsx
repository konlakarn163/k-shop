import { Link } from "react-router-dom"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatTHB } from "@/utils/formatCurrency"
import { applyImageFallback, resolveImageSrc } from "@/utils/resolveImage"
import type { Product } from "@/utils/mockProducts"

type ProductCardProps = {
  product: Product
  onAddToCart: () => void
  className?: string
}

export default function ProductCard({
  product,
  onAddToCart,
  className = "product-card group flex h-full min-h-[360px] flex-col overflow-hidden border-0 p-0 shadow-none transition",
}: ProductCardProps) {
  const isSale = product.id % 3 === 0
  const comparePrice = Math.round(product.price * 1.25)

  return (
    <Card className={className}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-56 overflow-hidden rounded-md bg-gray-400">
          {isSale && (
            <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              Sale
            </span>
          )}
          <img
            src={resolveImageSrc(product.imageOne)}
            alt={product.name}
            onError={applyImageFallback}
            className="h-56 w-full bg-gray-400 object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col space-y-1 px-2 py-3">
        <h3 className="truncate text-sm font-medium text-stone-800">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex gap-1 text-right">
            <p className="text-lg font-semibold leading-none text-stone-900">
              {formatTHB(product.price)}
            </p>
            {isSale && (
              <p className="text-xs text-stone-400 line-through">
                {formatTHB(comparePrice)}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-md bg-black p-4 text-[11px] uppercase tracking-[0.18em] !text-white hover:bg-stone-900"
            onClick={onAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}