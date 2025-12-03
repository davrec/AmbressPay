"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChefHat, Bell, CheckCircle, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils/format"
import { updateOrderStatus } from "@/app/actions/orders"
import { toast } from "sonner"
import type { Order, OrderStatus } from "@/lib/types"

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "In attesa", variant: "outline" },
  paid: { label: "Pagato", variant: "secondary" },
  preparing: { label: "In preparazione", variant: "default" },
  ready: { label: "Pronto", variant: "default" },
  completed: { label: "Completato", variant: "secondary" },
  cancelled: { label: "Annullato", variant: "destructive" },
}

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setLoadingId(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Stato aggiornato: ${statusConfig[newStatus].label}`)
      router.refresh()
    } catch (error) {
      toast.error("Errore nell'aggiornamento")
    } finally {
      setLoadingId(null)
    }
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Nessun ordine</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ordini recenti</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordine</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Articoli</TableHead>
                <TableHead>Totale</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-mono font-medium">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleString("it-IT", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      {order.items.map((item, i) => (
                        <span key={i} className="text-sm">
                          {item.quantity}x {item.name}
                          {i < order.items.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(order.total_cents)}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[order.status].variant}>{statusConfig[order.status].label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={loadingId === order.id}>
                          {loadingId === order.id ? "..." : "Cambia stato"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(order.id, "preparing")}
                          disabled={order.status === "preparing"}
                        >
                          <ChefHat className="mr-2 h-4 w-4" />
                          In preparazione
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(order.id, "ready")}
                          disabled={order.status === "ready"}
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Pronto
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(order.id, "completed")}
                          disabled={order.status === "completed"}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Completato
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(order.id, "cancelled")}
                          disabled={order.status === "cancelled"}
                          className="text-destructive"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Annulla
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
