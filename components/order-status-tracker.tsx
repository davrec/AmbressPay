"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Bell, CheckCircle2, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useOrderStatus } from "@/hooks/use-order-status"
import type { OrderStatus } from "@/lib/types"

const statusSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "paid", label: "Pagato", icon: <CheckCircle2 className="h-5 w-5" /> },
  { status: "preparing", label: "In preparazione", icon: <ChefHat className="h-5 w-5" /> },
  { status: "ready", label: "Pronto!", icon: <Bell className="h-5 w-5" /> },
]

interface OrderStatusTrackerProps {
  orderNumber: string
  initialStatus: OrderStatus
}

export function OrderStatusTracker({ orderNumber, initialStatus }: OrderStatusTrackerProps) {
  const { status: currentStatus } = useOrderStatus(orderNumber)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  const status = currentStatus ?? initialStatus

  useEffect(() => {
    // Check if notifications are already granted
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted")
    }
  }, [])

  const requestNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === "granted")
    }
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.status === status)

  return (
    <Card>
      <CardContent className="py-6">
        {/* Progress steps */}
        <div className="flex items-center justify-between mb-6">
          {statusSteps.map((step, index) => {
            const isActive = index <= currentStepIndex
            const isCurrent = step.status === status

            return (
              <div key={step.status} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      isActive
                        ? isCurrent
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded ${index < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Notification button */}
        {!notificationsEnabled && status !== "ready" && status !== "completed" && (
          <Button variant="outline" className="w-full bg-transparent" onClick={requestNotifications}>
            <Bell className="mr-2 h-4 w-4" />
            Attiva notifiche
          </Button>
        )}

        {status === "ready" && (
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <Bell className="h-8 w-8 mx-auto mb-2 text-primary animate-bounce" />
            <p className="font-bold text-primary">Il tuo ordine è pronto!</p>
            <p className="text-sm text-muted-foreground">Ritiralo al bancone mostrando il numero ordine</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
