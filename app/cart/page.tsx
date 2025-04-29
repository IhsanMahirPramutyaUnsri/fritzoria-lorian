"use client"

import { useState } from "react"

import { useEffect } from "react"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase"

export default function CartPage() {
  const { cartItems, isLoading, updateQuantity, removeFromCart, clearCart, subtotal } = useCart()
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClientSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setIsUserLoading(false)
    }

    checkUser()
  }, [])

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout")
    } else {
      router.push("/checkout")
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-12">
          <p>Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any books to your cart yet.</p>
          <Button onClick={() => router.push("/")}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                {item.book && (
                  <>
                    <div className="relative aspect-[2/3] w-24">
                      <Image
                        src={item.book.cover_image || "/placeholder.svg?height=150&width=100&query=book+cover"}
                        alt={item.book.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.book.title}</div>
                      <p className="text-sm text-muted-foreground">{item.book.author}</p>
                      <div className="mt-2">
                        {item.book.discount_price ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">${item.book.discount_price.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.book.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium">${item.book.price.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.book && item.quantity >= item.book.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">
                        ${((item.book.discount_price || item.book.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button variant="outline" onClick={() => clearCart()}>
              Clear Cart
            </Button>
          </div>
        </div>

        <div>
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-medium mb-4">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(subtotal * 0.1).toFixed(2)}</span>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${(subtotal + subtotal * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full mt-6" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
