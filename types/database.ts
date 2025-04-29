export type Book = {
  id: string
  title: string
  author: string
  publisher: string | null
  isbn: string | null
  description: string | null
  price: number
  discount_price: number | null
  stock: number
  cover_image: string | null
  page_count: number | null
  language: string | null
  publication_date: string | null
  created_at: string
  updated_at: string
  categories?: Category[]
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export type CartItem = {
  id: string
  cart_id: string
  book_id: string
  quantity: number
  created_at: string
  updated_at: string
  book?: Book
}

export type Order = {
  id: string
  user_id: string
  status: string
  total_amount: number
  shipping_address: string
  payment_method: string
  payment_status: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  book_id: string
  quantity: number
  price: number
  created_at: string
  book?: Book
}

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export type Review = {
  id: string
  book_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  user?: Profile
}
