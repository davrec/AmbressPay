"use server"

import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/server"
import { generateOrderNumber } from "@/lib/utils/format"
import type { CartItem, OrderItem } from "@/lib/types"

interface CheckoutData {
  items: CartItem[]
  customerName: string
  customerEmail: string
}

export async function createCheckoutSession(data: CheckoutData) {
  const { items, customerName, customerEmail } = data

  if (!items || items.length === 0) {
    throw new Error("Il carrello è vuoto")
  }

  if (!customerName.trim() || !customerEmail.trim()) {
    throw new Error("Nome e email sono obbligatori")
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(customerEmail)) {
    throw new Error("Email non valida")
  }

  // Get admin client to bypass RLS for inserting orders
  const supabase = await createAdminClient()

  // Fetch products from DB to validate prices (prevent tampering)
  const productIds = items.map((item) => item.product.id)
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .eq("available", true)

  if (productsError || !products) {
    throw new Error("Errore nel recupero dei prodotti")
  }

  // Validate all items exist and are available
  const validatedItems: OrderItem[] = []
  let totalCents = 0

  for (const item of items) {
    const product = products.find((p) => p.id === item.product.id)
    if (!product) {
      throw new Error(`Prodotto "${item.product.name}" non disponibile`)
    }

    validatedItems.push({
      product_id: product.id,
      name: product.name,
      quantity: item.quantity,
      price_cents: product.price_cents,
    })

    totalCents += product.price_cents * item.quantity
  }

  // Generate order number
  const orderNumber = generateOrderNumber()

  // Create order in DB with pending status
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim().toLowerCase(),
      items: validatedItems,
      total_cents: totalCents,
      status: "pending",
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error("Order creation error:", orderError)
    throw new Error("Errore nella creazione dell'ordine")
  }

  // Create Stripe checkout session
  const lineItems = validatedItems.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price_cents,
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    line_items: lineItems,
    payment_method_types: ["card"],
    // Apple Pay and Google Pay are automatically enabled for card payments
    metadata: {
      order_id: order.id,
      order_number: orderNumber,
    },
    customer_email: customerEmail.trim().toLowerCase(),
    redirect_on_completion: "never",
  })

  // Update order with Stripe session ID
  await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id)

  return {
    clientSecret: session.client_secret,
    orderNumber,
    orderId: order.id,
  }
}

export async function confirmPayment(sessionId: string) {
  const supabase = await createAdminClient()

  // Get session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== "paid") {
    throw new Error("Pagamento non completato")
  }

  const orderId = session.metadata?.order_id
  if (!orderId) {
    throw new Error("Ordine non trovato")
  }

  // Update order status to paid
  const { data: order, error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      stripe_payment_intent_id: session.payment_intent as string,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single()

  if (error || !order) {
    throw new Error("Errore nell'aggiornamento dell'ordine")
  }

  return order
}
