"use client"

import { Store } from "lucide-react"
import { CartSheet } from "@/components/cart-sheet"

interface MenuHeaderProps {
  storeName?: string
}

export function MenuHeader({ storeName = "Quick Order" }: MenuHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">{storeName}</h1>
            <p className="text-xs text-muted-foreground">Ordina e ritira</p>
          </div>
        </div>

        <CartSheet />
      </div>
    </header>
  )
}
