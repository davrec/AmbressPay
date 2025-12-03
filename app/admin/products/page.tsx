import { createAdminClient } from "@/lib/supabase/server"
import { ProductsManager } from "@/components/admin/products-manager"
import type { Product } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const supabase = await createAdminClient()

  const { data: products } = await supabase.from("products").select("*").order("position", { ascending: true })

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestione Prodotti</h1>
        <p className="text-muted-foreground">Aggiungi, modifica o disabilita i prodotti del menu</p>
      </div>

      <ProductsManager products={(products ?? []) as Product[]} />
    </div>
  )
}
