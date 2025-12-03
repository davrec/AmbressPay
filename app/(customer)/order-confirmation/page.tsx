import { CheckCircle2, Store } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createAdminClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils/format"
import { OrderStatusTracker } from "@/components/order-status-tracker"
import type { Order } from "@/lib/types"

interface OrderConfirmationPageProps {
  searchParams: Promise<{ order?: string }>
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const params = await searchParams
  const orderNumber = params.order

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Ordine non trovato</p>
            <Button asChild className="mt-4">
              <Link href="/">Torna al menu</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const supabase = await createAdminClient()
  const { data: order } = await supabase.from("orders").select("*").eq("order_number", orderNumber).single()

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Ordine non trovato</p>
            <Button asChild className="mt-4">
              <Link href="/">Torna al menu</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const typedOrder = order as Order

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-6 text-center">
        {/* Success icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>

        {/* Confirmation message */}
        <div>
          <h1 className="text-2xl font-bold mb-2">Ordine confermato!</h1>
          <p className="text-muted-foreground">
            Ordine: <span className="font-mono font-bold">{typedOrder.order_number}</span>
          </p>
          <p className="text-lg font-bold text-primary mt-2">{formatPrice(typedOrder.total_cents)}</p>
        </div>

        <OrderStatusTracker orderNumber={typedOrder.order_number} initialStatus={typedOrder.status} />

        {/* Pickup info */}
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-medium">Ritiro al bancone</p>
                <p className="text-sm text-muted-foreground">Mostra il numero ordine quando sei pronto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to menu */}
        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href="/">Nuovo ordine</Link>
        </Button>
      </div>
    </div>
  )
}
