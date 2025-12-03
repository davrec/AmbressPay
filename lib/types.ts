export interface Product {
  id: string
  name: string
  description: string | null
  price_cents: number
  image_url: string | null
  available: boolean
  position: number
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  product_id: string
  name: string
  quantity: number
  price_cents: number
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  items: OrderItem[]
  total_cents: number
  status: "pending" | "paid" | "preparing" | "ready" | "completed" | "cancelled"
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type OrderStatus = Order["status"]
