"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { CartItem, Book } from "@/types/database"
import { toast } from "@/components/ui/use-toast"

type CartContextType = {
  cartItems: (CartItem & { book?: Book })[]
  isLoading: boolean
  addToCart: (bookId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<(CartItem & { book?: Book })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cartId, setCartId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true)
      const supabase = createClientSupabaseClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Get user's cart
        const { data: carts } = await supabase.from("carts").select("id").eq("user_id", session.user.id).single()

        if (carts) {
          setCartId(carts.id)

          // Get cart items with book details
          const { data: items } = await supabase
            .from("cart_items")
            .select(`
              id,
              cart_id,
              book_id,
              quantity,
              created_at,
              updated_at,
              book:books(
                id,
                title,
                author,
                price,
                discount_price,
                cover_image,
                stock
              )
            `)
            .eq("cart_id", carts.id)

          setCartItems(items || [])
        }
      } else {
        // Use local storage for guest users
        const storedCart = localStorage.getItem("cart")
        if (storedCart) {
          setCartItems(JSON.parse(storedCart))
        }
      }

      setIsLoading(false)
    }

    fetchCart()

    const supabase = createClientSupabaseClient()
    const authListener = supabase.auth.onAuthStateChange(() => {
      fetchCart()
    })

    return () => {
      authListener.data.subscription.unsubscribe()
    }
  }, [])

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!isLoading && !cartId) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoading, cartId])

  const addToCart = async (bookId: string, quantity = 1) => {
    const supabase = createClientSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if book exists and has enough stock
    const { data: book } = await supabase
      .from("books")
      .select("id, title, stock, price, discount_price, cover_image, author")
      .eq("id", bookId)
      .single()

    if (!book) {
      toast({
        title: "Error",
        description: "Book not found",
        variant: "destructive",
      })
      return
    }

    if (book.stock < quantity) {
      toast({
        title: "Error",
        description: `Only ${book.stock} items available`,
        variant: "destructive",
      })
      return
    }

    if (session?.user && cartId) {
      // Logged in user - use database
      // Check if item already in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("book_id", bookId)
        .single()

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity

        if (newQuantity > book.stock) {
          toast({
            title: "Error",
            description: `Only ${book.stock} items available`,
            variant: "destructive",
          })
          return
        }

        const { error } = await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", existingItem.id)

        if (error) {
          toast({
            title: "Error",
            description: "Failed to update cart",
            variant: "destructive",
          })
          return
        }
      } else {
        // Add new item
        const { error } = await supabase.from("cart_items").insert({
          cart_id: cartId,
          book_id: bookId,
          quantity,
        })

        if (error) {
          toast({
            title: "Error",
            description: "Failed to add to cart",
            variant: "destructive",
          })
          return
        }
      }

      // Refresh cart items
      const { data: items } = await supabase
        .from("cart_items")
        .select(`
          id,
          cart_id,
          book_id,
          quantity,
          created_at,
          updated_at,
          book:books(
            id,
            title,
            author,
            price,
            discount_price,
            cover_image,
            stock
          )
        `)
        .eq("cart_id", cartId)

      setCartItems(items || [])
    } else {
      // Guest user - use local storage
      const existingItemIndex = cartItems.findIndex((item) => item.book_id === bookId)

      if (existingItemIndex >= 0) {
        // Update quantity
        const newCartItems = [...cartItems]
        const newQuantity = newCartItems[existingItemIndex].quantity + quantity

        if (newQuantity > book.stock) {
          toast({
            title: "Error",
            description: `Only ${book.stock} items available`,
            variant: "destructive",
          })
          return
        }

        newCartItems[existingItemIndex].quantity = newQuantity
        setCartItems(newCartItems)
      } else {
        // Add new item
        const newItem: CartItem & { book?: Book } = {
          id: `local-${Date.now()}`,
          cart_id: "local-cart",
          book_id: bookId,
          quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          book,
        }

        setCartItems([...cartItems, newItem])
      }
    }

    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart`,
    })
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(itemId)
    }

    const supabase = createClientSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user && cartId) {
      // Get the book to check stock
      const item = cartItems.find((item) => item.id === itemId)
      if (!item || !item.book) return

      if (quantity > item.book.stock) {
        toast({
          title: "Error",
          description: `Only ${item.book.stock} items available`,
          variant: "destructive",
        })
        return
      }

      // Update in database
      const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update quantity",
          variant: "destructive",
        })
        return
      }

      // Update local state
      setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    } else {
      // Update in local storage
      const item = cartItems.find((item) => item.id === itemId)
      if (!item || !item.book) return

      if (quantity > item.book.stock) {
        toast({
          title: "Error",
          description: `Only ${item.book.stock} items available`,
          variant: "destructive",
        })
        return
      }

      setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = async (itemId: string) => {
    const supabase = createClientSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user && cartId) {
      // Remove from database
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove item",
          variant: "destructive",
        })
        return
      }
    }

    // Update local state
    setCartItems(cartItems.filter((item) => item.id !== itemId))

    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    })
  }

  const clearCart = async () => {
    const supabase = createClientSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user && cartId) {
      // Clear database cart
      const { error } = await supabase.from("cart_items").delete().eq("cart_id", cartId)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to clear cart",
          variant: "destructive",
        })
        return
      }
    }

    // Clear local state
    setCartItems([])

    if (!session?.user) {
      localStorage.removeItem("cart")
    }

    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    if (!item.book) return total
    const price = item.book.discount_price || item.book.price
    return total + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
