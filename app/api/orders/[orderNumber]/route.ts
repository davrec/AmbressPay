import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params

  const supabase = await createAdminClient()

  const { data: order, error } = await supabase
    .from("orders")
    .select("order_number, status, updated_at")
    .eq("order_number", orderNumber)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(order)
}
