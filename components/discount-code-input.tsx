"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { validateDiscount } from "@/lib/discount-actions"
import { toast } from "@/components/ui/use-toast"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Discount } from "@/types/database"

interface DiscountCodeInputProps {
  subtotal: number
  cartItems: any[]
  onApplyDiscount: (discount: Discount, discountAmount: number) => void
  onRemoveDiscount: () => void
}

export default function DiscountCodeInput({
  subtotal,
  cartItems,
  onApplyDiscount,
  onRemoveDiscount,
}: DiscountCodeInputProps) {
  const [discountCode, setDiscountCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return

    setIsLoading(true)

    try {
      const supabase = createClientSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user?.id || ""

      const result = await validateDiscount(discountCode, userId, cartItems, subtotal)

      if (result.valid && result.discount) {
        setAppliedDiscount(result.discount)
        setDiscountAmount(result.discountAmount)
        onApplyDiscount(result.discount, result.discountAmount)
        toast({
          title: "Diskon diterapkan",
          description: `Diskon ${result.discount.name} berhasil diterapkan`,
        })
      } else {
        toast({
          title: "Gagal menerapkan diskon",
          description: result.message || "Kode diskon tidak valid",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memproses kode diskon",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountAmount(0)
    setDiscountCode("")
    onRemoveDiscount()
  }

  return (
    <div className="space-y-2">
      {!appliedDiscount ? (
        <div className="flex space-x-2">
          <Input
            placeholder="Masukkan kode diskon"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={handleApplyDiscount} disabled={isLoading || !discountCode.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Terapkan"}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-primary/10 p-2 rounded-md">
          <div>
            <p className="font-medium">{appliedDiscount.name}</p>
            <p className="text-sm text-muted-foreground">
              {appliedDiscount.discount_type?.name === "percentage"
                ? `${appliedDiscount.value}% off`
                : `Rp ${appliedDiscount.value.toLocaleString("id-ID")} off`}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemoveDiscount}>
            Hapus
          </Button>
        </div>
      )}
    </div>
  )
}
