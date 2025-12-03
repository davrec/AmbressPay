import { createClient } from "@/lib/supabase/server"
import { MenuHeader } from "@/components/menu-header"
import { ProductCard } from "@/components/product-card"
import { CartFooter } from "@/components/cart-footer"
import type { Product } from "@/lib/types"

export default async function MenuPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("position", { ascending: true })
    .limit(5)

  return (
    <div className="min-h-screen bg-background pb-24">
      <MenuHeader storeName="Il Tuo Locale" />

      <main className="px-4 py-6">
        {/* Hero section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Cosa ti prepariamo?</h2>
          <p className="mt-1 text-muted-foreground">Ordina ora e salta la fila alla cassa</p>
        </div>

        {/* Products list */}
        <div className="flex flex-col gap-3">
          {products && products.length > 0 ? (
            (products as Product[]).map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nessun prodotto disponibile al momento</p>
            </div>
          )}
        </div>
      </main>

      {/* Fixed bottom cart bar */}
      <CartFooter />
    </div>
  )
}
