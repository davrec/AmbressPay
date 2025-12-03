import { createAdminClient } from "@/lib/supabase/server"
import { OrdersTable } from "@/components/admin/orders-table"
import { OrderStats } from "@/components/admin/order-stats"
import type { Order } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const supabase = await createAdminClient()

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50)

  const typedOrders = (orders ?? []) as Order[]

  // Calculate stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrders = typedOrders.filter((o) => new Date(o.created_at) >= today)
  const pendingOrders = typedOrders.filter((o) => o.status === "paid" || o.status === "preparing")
  const todayRevenue = todayOrders
    .filter((o) => o.status !== "pending" && o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total_cents, 0)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestione Ordini</h1>
        <p className="text-muted-foreground">Visualizza e gestisci tutti gli ordini</p>
      </div>

      {/* Stats */}
      <OrderStats todayOrders={todayOrders.length} pendingOrders={pendingOrders.length} todayRevenue={todayRevenue} />

      {/* Orders table */}
      <OrdersTable orders={typedOrders} />
    </div>
  )
}
