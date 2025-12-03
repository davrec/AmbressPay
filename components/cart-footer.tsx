"use client"

import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils/format"

export function CartFooter() {
  const { totalItems, totalCents } = useCart()

  if (totalItems === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 safe-area-inset-bottom">
      <Button asChild className="w-full h-14 text-base" size="lg">
        <Link href="/checkout">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span>
                {totalItems} {totalItems === 1 ? "articolo" : "articoli"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatPrice(totalCents)}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </Button>
    </div>
  )
}
