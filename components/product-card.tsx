"use client"

import Image from "next/image"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils/format"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart()

  const cartItem = items.find((item) => item.product.id === product.id)
  const quantity = cartItem?.quantity ?? 0

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-card">
      <div className="flex gap-3 p-3">
        {/* Product image */}
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image_url || "/placeholder.svg?height=80&width=80&query=food"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Product info */}
        <CardContent className="flex flex-1 flex-col justify-between p-0">
          <div>
            <h3 className="font-semibold text-foreground leading-tight">{product.name}</h3>
            {product.description && (
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="font-bold text-primary">{formatPrice(product.price_cents)}</span>

            {/* Quantity controls */}
            {quantity === 0 ? (
              <Button size="sm" onClick={() => addItem(product)} className="h-9 px-4 touch-action-manipulation">
                <Plus className="mr-1 h-4 w-4" />
                Aggiungi
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 touch-action-manipulation bg-transparent"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 touch-action-manipulation bg-transparent"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
