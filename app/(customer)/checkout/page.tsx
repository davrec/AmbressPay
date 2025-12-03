"use client"

import { useState } from "react"
import { ArrowLeft, User, Mail, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils/format"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  const { items, totalItems, totalCents } = useCart()
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [showPayment, setShowPayment] = useState(false)

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold mb-2">Carrello vuoto</h1>
          <p className="text-muted-foreground mb-4">Aggiungi qualcosa dal menu per procedere</p>
          <Button asChild>
            <Link href="/">Torna al menu</Link>
          </Button>
        </div>
      </div>
    )
  }

  const canProceed = customerName.trim().length > 0 && customerEmail.trim().length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center gap-3 px-4 h-14">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Torna al menu</span>
            </Link>
          </Button>
          <h1 className="font-semibold">Checkout</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-32">
        {/* Order summary */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Riepilogo ordine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-medium">{formatPrice(item.product.price_cents * item.quantity)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Totale</span>
              <span className="text-primary">{formatPrice(totalCents)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer info */}
        {!showPayment ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">I tuoi dati</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Nome
                </Label>
                <Input
                  id="name"
                  placeholder="Il tuo nome"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@esempio.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">Riceverai una notifica quando il tuo ordine sarà pronto</p>
              </div>

              <Button className="w-full h-12 mt-4" disabled={!canProceed} onClick={() => setShowPayment(true)}>
                Continua al pagamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <CheckoutForm
            customerName={customerName}
            customerEmail={customerEmail}
            onBack={() => setShowPayment(false)}
          />
        )}
      </main>
    </div>
  )
}
