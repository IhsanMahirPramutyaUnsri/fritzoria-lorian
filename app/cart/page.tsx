"use client"

import { useState } from "react"

import { useEffect } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
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
        <h1 className="text-3xl font-bold mb-8">Keranjang Belanja Anda</h1>
        <div className="text-center py-12">
          <p>Memuat keranjang belanja Anda...</p>
        </div>
      </div>
    )
  }

  // Always show empty cart
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Keranjang Belanja Anda</h1>
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-medium mb-2">Keranjang belanja Anda kosong</h2>
        <p className="text-muted-foreground mb-6">Produk tidak tersedia saat ini. Silakan coba lagi nanti.</p>
        <Button onClick={() => router.push("/")}>Kembali ke Beranda</Button>
      </div>
    </div>
  )
}
