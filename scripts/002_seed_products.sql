-- Seed sample products (max 5 as requested)
INSERT INTO products (name, description, price_cents, image_url, available, position) VALUES
  ('Espresso', 'Caffè espresso italiano classico', 150, '/placeholder.svg?height=200&width=200', true, 1),
  ('Cappuccino', 'Espresso con latte montato e schiuma', 300, '/placeholder.svg?height=200&width=200', true, 2),
  ('Cornetto', 'Cornetto fresco con crema o marmellata', 200, '/placeholder.svg?height=200&width=200', true, 3),
  ('Panino Prosciutto', 'Panino con prosciutto crudo e mozzarella', 550, '/placeholder.svg?height=200&width=200', true, 4),
  ('Spremuta Arancia', 'Spremuta fresca di arance siciliane', 400, '/placeholder.svg?height=200&width=200', true, 5)
ON CONFLICT DO NOTHING;
