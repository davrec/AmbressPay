"use client"

import useSWR from "swr"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import type { OrderStatus } from "@/lib/types"

interface OrderStatusData {
  order_number: string
  status: OrderStatus
  updated_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useOrderStatus(orderNumber: string | null) {
  const previousStatus = useRef<OrderStatus | null>(null)

  const { data, error, isLoading } = useSWR<OrderStatusData>(
    orderNumber ? `/api/orders/${orderNumber}` : null,
    fetcher,
    {
      refreshInterval: 5000, // Poll every 5 seconds
      revalidateOnFocus: true,
    },
  )

  // Show notification when status changes to "ready"
  useEffect(() => {
    if (data?.status && previousStatus.current !== null) {
      if (data.status === "ready" && previousStatus.current !== "ready") {
        // Show toast notification
        toast.success("Il tuo ordine è pronto!", {
          description: `Ordine ${data.order_number} - Ritiralo al bancone`,
          duration: 10000,
        })

        // Try to show browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Ordine Pronto!", {
            body: `Il tuo ordine ${data.order_number} è pronto per il ritiro`,
            icon: "/icon-dark-32x32.png",
          })
        }
      }
    }
    previousStatus.current = data?.status ?? null
  }, [data?.status, data?.order_number])

  return {
    status: data?.status,
    isLoading,
    error,
  }
}
