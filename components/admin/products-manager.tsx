"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice } from "@/lib/utils/format"
import { saveProduct, deleteProduct, toggleProductAvailability } from "@/app/actions/products"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

interface ProductsManagerProps {
  products: Product[]
}

export function ProductsManager({ products }: ProductsManagerProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenDialog = (product?: Product) => {
    setEditingProduct(product ?? null)
    setIsDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      id: editingProduct?.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price_cents: Math.round(Number.parseFloat(formData.get("price") as string) * 100),
      image_url: (formData.get("image_url") as string) || null,
      position: Number.parseInt(formData.get("position") as string) || 0,
      available: true,
    }

    try {
      await saveProduct(data)
      toast.success(editingProduct ? "Prodotto aggiornato" : "Prodotto creato")
      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Errore nel salvataggio")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAvailability = async (product: Product) => {
    try {
      await toggleProductAvailability(product.id, !product.available)
      toast.success(product.available ? "Prodotto nascosto" : "Prodotto visibile")
      router.refresh()
    } catch (error) {
      toast.error("Errore nell'aggiornamento")
    }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Eliminare "${product.name}"?`)) return

    try {
      await deleteProduct(product.id)
      toast.success("Prodotto eliminato")
      router.refresh()
    } catch (error) {
      toast.error("Errore nell'eliminazione")
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nuovo prodotto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Modifica prodotto" : "Nuovo prodotto"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" required defaultValue={editingProduct?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea id="description" name="description" defaultValue={editingProduct?.description ?? ""} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prezzo (EUR)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={editingProduct ? (editingProduct.price_cents / 100).toFixed(2) : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Posizione</Label>
                  <Input
                    id="position"
                    name="position"
                    type="number"
                    min="0"
                    defaultValue={editingProduct?.position ?? products.length + 1}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">URL Immagine (opzionale)</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="https://..."
                  defaultValue={editingProduct?.image_url ?? ""}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvataggio..." : "Salva"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prodotti ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nessun prodotto. Clicca "Nuovo prodotto" per iniziare.
            </p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
                      {product.position}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{product.name}</p>
                        {!product.available && <Badge variant="secondary">Nascosto</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{formatPrice(product.price_cents)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleAvailability(product)}
                      title={product.available ? "Nascondi" : "Mostra"}
                    >
                      {product.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
