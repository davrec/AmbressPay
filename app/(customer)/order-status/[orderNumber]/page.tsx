import type React from "react"
import { redirect } from "next/navigation"
import { CheckCircle2, Clock, ChefHat, Bell, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createAdminClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils/format"
import type { Order, OrderStatus } from "@/lib/types"

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "In attesa", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-500" },
  paid: { label: "Pagato", icon: <CheckCircle2 className="h-5 w-5" />, color: "bg-blue-500" },
  preparing: { label: "In preparazione", icon: <ChefHat className="h-5 w-5" />, color: "bg-orange-500" },
  ready: { label: "Pronto!", icon: <Bell className="h-5 w-5" />, color: "bg-primary" },
  completed: { label: "Completato", icon: <Package className="h-5 w-5" />, color: "bg-muted-foreground" },
  cancelled: { label: "Annullato", icon: <Clock className="h-5 w-5" />, color: "bg-destructive" },
}

interface OrderStatusPageProps {
  params: Promise<{ orderNumber: string }>
}

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { orderNumber } = await params

  const supabase = await createAdminClient()
  const { data: order } = await supabase.from("orders").select("*").eq("order_number", orderNumber).single()

  if (!order) {
    redirect("/")
  }

  const typedOrder = order as Order
  const status = statusConfig[typedOrder.status]

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-sm mx-auto space-y-6 pt-8">
        {/* Status badge */}
        <div className="text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${status.color} text-white`}
          >
            {status.icon}
          </div>
          <Badge variant="secondary" className="text-sm">
            {status.label}
          </Badge>
          <h1 className="mt-4 text-xl font-bold">Ordine {typedOrder.order_number}</h1>
        </div>

        {/* Order items */}
        <Card>
          <CardContent className="py-4 space-y-3">
            {typedOrder.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>{formatPrice(item.price_cents * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Totale</span>
              <span>{formatPrice(typedOrder.total_cents)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Status message */}
        {typedOrder.status === "ready" && (
          <Card className="bg-primary/10 border-primary">
            <CardContent className="py-4 text-center">
              <Bell className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-bold text-primary">Il tuo ordine è pronto!</p>
              <p className="text-sm text-muted-foreground">Ritiralo al bancone mostrando questo numero</p>
            </CardContent>
          </Card>
        )}

        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href="/">Nuovo ordine</Link>
        </Button>
      </div>
    </div>
  )
}
