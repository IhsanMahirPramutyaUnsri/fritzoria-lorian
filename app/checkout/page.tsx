"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import DiscountCodeInput from "@/components/discount-code-input"
import type { Discount } from "@/types/database"

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, subtotal, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  })

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClientSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push("/login?redirect=/checkout")
        return
      }

      setUser(session.user)

      // Get user profile
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (profile) {
        setFormData({
          fullName: profile.full_name || "",
          email: session.user.email || "",
          address: profile.address || "",
          city: "",
          postalCode: "",
          phone: profile.phone || "",
        })
      } else {
        setFormData({
          ...formData,
          email: session.user.email || "",
        })
      }

      setIsUserLoading(false)
    }

    checkUser()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real application, you would:
      // 1. Create an order in the database
      // 2. Process payment
      // 3. Update inventory
      // 4. Send confirmation email

      // For now, we'll just simulate a successful order
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearCart()
      router.push("/order-success")
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memproses pesanan Anda",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyDiscount = (discount: Discount, amount: number) => {
    setAppliedDiscount(discount)
    setDiscountAmount(amount)
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountAmount(0)
  }

  const shippingCost = 15000
  const total = subtotal + shippingCost - discountAmount

  if (isUserLoading) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengiriman</CardTitle>
              <CardDescription>Masukkan alamat pengiriman Anda</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Kode Pos</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Selesaikan Pesanan"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
              <CardDescription>Detail pesanan Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-muted-foreground">Keranjang belanja Anda kosong</p>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p>
                          {item.book?.title} <span className="text-muted-foreground">x{item.quantity}</span>
                        </p>
                      </div>
                      <p>{formatCurrency(item.book?.price * item.quantity)}</p>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <Label>Kode Diskon</Label>
                    <DiscountCodeInput
                      subtotal={subtotal}
                      cartItems={cartItems}
                      onApplyDiscount={handleApplyDiscount}
                      onRemoveDiscount={handleRemoveDiscount}
                    />
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>{formatCurrency(subtotal)}</p>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <p>Diskon</p>
                      <p>-{formatCurrency(discountAmount)}</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <p>Biaya Pengiriman</p>
                    <p>{formatCurrency(shippingCost)}</p>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold">
                    <p>Total</p>
                    <p>{formatCurrency(total)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
