"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/components/ui/use-toast"

interface BookDisplayProps {
  id: string
  title: string
  author: string
  price: number
  coverImage: string | null
  discountPrice?: number | null
}

export default function BookDisplay({ id, title, author, price, coverImage, discountPrice }: BookDisplayProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    try {
      await addToCart(id, 1)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan ke keranjang",
        variant: "destructive",
      })
    }
  }

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md h-full max-w-xs mx-auto w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/books/${id}`} className="flex-1">
        <div className="group-hover:opacity-95 transition-all duration-300 p-4 flex items-center justify-center bg-white rounded-lg overflow-hidden">
          <div
            className={`relative w-full aspect-[2/3] overflow-hidden rounded-md shadow-md transition-all duration-300 group-hover:shadow-lg ${isHovered ? "transform rotate-y-30" : ""}`}
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.5s",
              transform: isHovered ? "rotate3d(0, 1, 0, 30deg)" : "none",
            }}
          >
            <div
              className="absolute top-0 left-0 w-[10px] h-full bg-black/10"
              style={{
                transform: "translateX(-5px) rotateY(-90deg)",
                transformOrigin: "right",
              }}
            ></div>
            <div
              className="absolute top-[2px] bottom-[2px] left-0 w-[10px] bg-white"
              style={{
                transform: "translateX(-3px) rotateY(-90deg)",
                transformOrigin: "right",
                zIndex: -1,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-0"></div>
            <Image
              src={coverImage || "/placeholder.svg?height=400&width=300&query=book cover"}
              alt={title}
              fill
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
            />
            <div className="absolute inset-0 border border-black/5 rounded-md pointer-events-none"></div>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4 pt-2">
        <Link href={`/books/${id}`}>
          <h3 className="line-clamp-1 text-base font-medium hover:text-primary transition-colors">{title}</h3>
        </Link>
        <p className="line-clamp-1 text-sm text-muted-foreground">{author}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            {discountPrice ? (
              <div className="flex flex-col">
                <p className="text-base font-semibold">{formatCurrency(discountPrice)}</p>
                <p className="text-xs text-muted-foreground line-through">{formatCurrency(price)}</p>
              </div>
            ) : (
              <p className="text-base font-semibold">{formatCurrency(price)}</p>
            )}
          </div>
          <button
            className="h-8 rounded-full px-3 bg-primary text-white flex items-center justify-center"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Tambah ke keranjang</span>
          </button>
        </div>
      </div>
    </div>
  )
}
