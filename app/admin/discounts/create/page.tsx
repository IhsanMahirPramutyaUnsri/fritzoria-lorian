"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { createDiscount, getDiscountTypes } from "@/lib/discount-actions"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import type { DiscountType } from "@/types/database"

export default function CreateDiscountPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [discountTypes, setDiscountTypes] = useState<DiscountType[]>([])
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discount_type_id: "",
    value: 0,
    min_purchase_amount: 0,
    min_quantity: 1,
    max_uses: null as number | null,
    start_date: new Date().toISOString().split("T")[0],
    end_date: null as string | null,
    is_active: true,
  })

  useEffect(() => {
    const fetchDiscountTypes = async () => {
      try {
        const types = await getDiscountTypes()
        setDiscountTypes(types)
        if (types.length > 0) {
          setFormData((prev) => ({ ...prev, discount_type_id: types[0].id }))
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat tipe diskon",
          variant: "destructive",
        })
      }
    }

    fetchDiscountTypes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value === "" ? 0 : Number(value) }))
  }

  const handleNullableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value === "" ? null : Number(value) }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value === "" ? null : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createDiscount(formData)
      toast({
        title: "Diskon berhasil dibuat",
        description: `Diskon ${formData.name} telah berhasil dibuat`,
      })
      router.push("/admin/discounts")
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat diskon",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Buat Diskon Baru</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Detail Diskon</CardTitle>
            <CardDescription>Masukkan informasi untuk diskon baru</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Kode Diskon</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="SUMMER10"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Diskon</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Summer Sale 10% Off"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Diskon musim panas untuk semua produk"
                value={formData.description || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="discount_type_id">Tipe Diskon</Label>
                <Select
                  value={formData.discount_type_id}
                  onValueChange={(value) => handleSelectChange("discount_type_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe diskon" />
                  </SelectTrigger>
                  <SelectContent>
                    {discountTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name === "percentage"
                          ? "Persentase"
                          : type.name === "fixed_amount"
                            ? "Nominal Tetap"
                            : type.name === "buy_x_get_y"
                              ? "Beli X Gratis Y"
                              : "Gratis Ongkir"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Nilai Diskon</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={handleNumberChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {discountTypes.find((t) => t.id === formData.discount_type_id)?.name === "percentage"
                    ? "Dalam persentase (%), misal: 10 untuk 10% diskon"
                    : "Dalam Rupiah, misal: 10000 untuk Rp 10.000 diskon"}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min_purchase_amount">Minimum Pembelian (Rp)</Label>
                <Input
                  id="min_purchase_amount"
                  name="min_purchase_amount"
                  type="number"
                  min="0"
                  value={formData.min_purchase_amount}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_quantity">Minimum Jumlah Item</Label>
                <Input
                  id="min_quantity"
                  name="min_quantity"
                  type="number"
                  min="1"
                  value={formData.min_quantity}
                  onChange={handleNumberChange}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="max_uses">Maksimum Penggunaan</Label>
                <Input
                  id="max_uses"
                  name="max_uses"
                  type="number"
                  min="0"
                  placeholder="Kosongkan untuk tidak terbatas"
                  value={formData.max_uses === null ? "" : formData.max_uses}
                  onChange={handleNullableNumberChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_active" className="block mb-2">
                  Status
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    {formData.is_active ? "Aktif" : "Tidak Aktif"}
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Tanggal Mulai</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleDateChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Tanggal Berakhir</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  placeholder="Kosongkan untuk tidak terbatas"
                  value={formData.end_date || ""}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Buat Diskon
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
