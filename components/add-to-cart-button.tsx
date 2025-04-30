"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/components/ui/use-toast"

interface AddToCartButtonProps {
  bookId: string
  className?: string
}

export default function AddToCartButton({ bookId, className }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await addToCart(bookId, 1)
      toast({
        title: "Ditambahkan ke keranjang",
        description: "Buku telah ditambahkan ke keranjang Anda",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan ke keranjang",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={isLoading} className={className}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
      Tambah ke Keranjang
    </Button>
  )
}
