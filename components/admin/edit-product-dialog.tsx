"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface Product {
  id: string
  title: string
  author: string
  price: number
  stock: number
  description: string | null
}

interface EditProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function EditProductDialog({ open, onOpenChange, product }: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    title: product.title,
    author: product.author,
    price: product.price.toString(),
    stock: product.stock.toString(),
    description: product.description || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when product changes
  useEffect(() => {
    setFormData({
      title: product.title,
      author: product.author,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || "",
    })
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClientSupabaseClient()

      // Validate form data
      if (!formData.title || !formData.author || !formData.price || !formData.stock) {
        throw new Error("Semua field wajib diisi")
      }

      // Convert price and stock to numbers
      const price = Number(formData.price)
      const stock = Number(formData.stock)

      if (isNaN(price) || price <= 0) {
        throw new Error("Harga harus berupa angka positif")
      }

      if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
        throw new Error("Stok harus berupa angka bulat non-negatif")
      }

      // Update the product
      const { error } = await supabase
        .from("books")
        .update({
          title: formData.title,
          author: formData.author,
          price,
          stock,
          description: formData.description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id)

      if (error) {
        throw error
      }

      toast({
        title: "Produk diperbarui",
        description: "Data produk berhasil diperbarui",
      })

      // Close dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal memperbarui produk",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Penulis</Label>
            <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1000"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stok</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
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
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
