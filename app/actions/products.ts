"use server"

import { createAdminClient } from "@/lib/supabase/server"

interface ProductData {
  id?: string
  name: string
  description: string
  price_cents: number
  image_url: string | null
  position: number
  available: boolean
}

export async function saveProduct(data: ProductData) {
  const supabase = await createAdminClient()

  if (data.id) {
    // Update existing product
    const { error } = await supabase
      .from("products")
      .update({
        name: data.name,
        description: data.description,
        price_cents: data.price_cents,
        image_url: data.image_url,
        position: data.position,
      })
      .eq("id", data.id)

    if (error) throw new Error("Errore nell'aggiornamento del prodotto")
  } else {
    // Create new product
    const { error } = await supabase.from("products").insert({
      name: data.name,
      description: data.description,
      price_cents: data.price_cents,
      image_url: data.image_url,
      position: data.position,
      available: true,
    })

    if (error) throw new Error("Errore nella creazione del prodotto")
  }

  return { success: true }
}

export async function toggleProductAvailability(productId: string, available: boolean) {
  const supabase = await createAdminClient()

  const { error } = await supabase.from("products").update({ available }).eq("id", productId)

  if (error) throw new Error("Errore nell'aggiornamento")

  return { success: true }
}

export async function deleteProduct(productId: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase.from("products").delete().eq("id", productId)

  if (error) throw new Error("Errore nell'eliminazione")

  return { success: true }
}
