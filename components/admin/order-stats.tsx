import { ClipboardList, Clock, Euro } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils/format"

interface OrderStatsProps {
  todayOrders: number
  pendingOrders: number
  todayRevenue: number
}

export function OrderStats({ todayOrders, pendingOrders, todayRevenue }: OrderStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ordini oggi</p>
            <p className="text-2xl font-bold">{todayOrders}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
            <Clock className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Da preparare</p>
            <p className="text-2xl font-bold">{pendingOrders}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <Euro className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Incasso oggi</p>
            <p className="text-2xl font-bold">{formatPrice(todayRevenue)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
