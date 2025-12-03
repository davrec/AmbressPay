"use server"

import { createAdminClient } from "@/lib/supabase/server"
import type { OrderStatus, Order } from "@/lib/types"

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createAdminClient()

  // Get order details for notification
  const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).single()

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    throw new Error("Errore nell'aggiornamento dello stato")
  }

  if (status === "ready" && order) {
    await sendOrderReadyNotification(order as Order)
  }

  return { success: true }
}

// Simple email notification using fetch to a hypothetical email service
// In production, you'd use Resend, SendGrid, or similar
async function sendOrderReadyNotification(order: Order) {
  // For now, we'll log the notification - in production integrate with Resend
  console.log(`[Notification] Order ${order.order_number} is ready for ${order.customer_email}`)

  // The notification will be shown in the app via polling or real-time subscription
  // Email integration can be added later with Resend (free tier: 100 emails/day)
}
