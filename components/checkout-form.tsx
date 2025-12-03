"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/cart-provider"
import { createCheckoutSession } from "@/app/actions/checkout"
import { toast } from "sonner"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  customerName: string
  customerEmail: string
  onBack: () => void
}

export function CheckoutForm({ customerName, customerEmail, onBack }: CheckoutFormProps) {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      const result = await createCheckoutSession({
        items,
        customerName,
        customerEmail,
      })
      setOrderNumber(result.orderNumber)
      return result.clientSecret!
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore nel checkout"
      setError(message)
      throw err
    }
  }, [items, customerName, customerEmail])

  const handleComplete = useCallback(async () => {
    try {
      // The payment was completed
      clearCart()
      toast.success("Pagamento completato!")
      router.push(`/order-confirmation?order=${orderNumber}`)
    } catch (err) {
      console.error("Error completing order:", err)
    }
  }, [clearCart, router, orderNumber])

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna indietro
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Pagamento</CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Modifica dati
          </Button>
        </div>
        {orderNumber && (
          <p className="text-sm text-muted-foreground">
            Ordine: <span className="font-mono font-medium">{orderNumber}</span>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{
            fetchClientSecret,
            onComplete: handleComplete,
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </CardContent>
    </Card>
  )
}
