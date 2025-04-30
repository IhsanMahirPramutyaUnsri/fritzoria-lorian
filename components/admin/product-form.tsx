"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, Upload, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { updateProduct, createProduct } from "@/lib/admin-actions"
import { createClientSupabaseClient } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"

interface ProductFormProps {
  product?: any
  categories: any[]
  subcategories: any[]
}

export default function ProductForm({ product, categories, subcategories }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product

  const [formData, setFormData] = useState({
    title: product?.title || "",
    author: product?.author || "",
    publisher: product?.publisher || "",
    isbn: product?.isbn || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    page_count: product?.page_count || 0,
    language: product?.language || "Indonesia",
    publication_date: product?.publication_date ? new Date(product.publication_date).toISOString().split("T")[0] : "",
    cover_image: product?.cover_image || "",
    selectedCategories: product?.categories?.map((c: any) => c.id) || [],
    selectedSubcategories: product?.subcategories?.map((s: any) => s.id) || [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value === "" ? 0 : Number.parseInt(value) }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev) => {
      const selectedCategories = prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter((id) => id !== categoryId)
        : [...prev.selectedCategories, categoryId]

      return { ...prev, selectedCategories }
    })
  }

  const handleSubcategoryChange = (subcategoryId: string) => {
    setFormData((prev) => {
      const selectedSubcategories = prev.selectedSubcategories.includes(subcategoryId)
        ? prev.selectedSubcategories.filter((id) => id !== subcategoryId)
        : [...prev.selectedSubcategories, subcategoryId]

      return { ...prev, selectedSubcategories }
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipe file tidak valid",
        description: "Harap unggah file gambar (JPG, PNG, GIF)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Ukuran file terlalu besar",
        description: "Ukuran file maksimal adalah 2MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const supabase = createClientSupabaseClient()

      // Generate a unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `book-covers/${fileName}`

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("public").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage.from("public").getPublicUrl(filePath)

      // Update form data with the new image URL
      setFormData((prev) => ({
        ...prev,
        cover_image: publicUrlData.publicUrl,
      }))

      toast({
        title: "Gambar berhasil diunggah",
        description: "Gambar sampul buku telah berhasil diunggah",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Gagal mengunggah gambar",
        description: "Terjadi kesalahan saat mengunggah gambar",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, cover_image: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Judul buku wajib diisi"
    }

    if (!formData.author.trim()) {
      newErrors.author = "Nama penulis wajib diisi"
    }

    if (formData.price <= 0) {
      newErrors.price = "Harga harus lebih dari 0"
    }

    if (formData.stock < 0) {
      newErrors.stock = "Stok tidak boleh negatif"
    }

    if (formData.selectedCategories.length === 0) {
      newErrors.categories = "Pilih minimal satu kategori"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Formulir tidak valid",
        description: "Harap perbaiki kesalahan pada formulir",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const productData = {
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        isbn: formData.isbn,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        cover_image: formData.cover_image,
        page_count: formData.page_count,
        language: formData.language,
        publication_date: formData.publication_date,
        categories: formData.selectedCategories,
        subcategories: formData.selectedSubcategories,
      }

      if (isEditing) {
        await updateProduct(product.id, productData)
        toast({
          title: "Produk diperbarui",
          description: "Produk telah berhasil diperbarui",
        })
      } else {
        await createProduct(productData)
        toast({
          title: "Produk ditambahkan",
          description: "Produk baru telah berhasil ditambahkan",
        })
      }

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Gagal menyimpan produk",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan produk",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter subcategories based on selected categories
  const filteredSubcategories = subcategories.filter((sub) => formData.selectedCategories.includes(sub.category_id))

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
          <TabsTrigger value="details">Detail Produk</TabsTrigger>
          <TabsTrigger value="categories">Kategori</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Masukkan informasi dasar tentang buku</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
                    Judul Buku <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author" className={errors.author ? "text-destructive" : ""}>
                    Penulis <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={errors.author ? "border-destructive" : ""}
                  />
                  {errors.author && <p className="text-sm text-destructive">{errors.author}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publisher">Penerbit</Label>
                  <Input id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className={errors.price ? "text-destructive" : ""}>
                    Harga <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleNumberChange}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                  {formData.price > 0 && (
                    <p className="text-sm text-muted-foreground">{formatCurrency(formData.price)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className={errors.stock ? "text-destructive" : ""}>
                    Stok <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleNumberChange}
                    className={errors.stock ? "border-destructive" : ""}
                  />
                  {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Gambar Sampul</Label>
                <div className="flex items-start gap-6">
                  <div className="w-32 h-48 relative border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {formData.cover_image ? (
                      <Image
                        src={formData.cover_image || "/placeholder.svg"}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground text-center px-2">Tidak ada gambar</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("cover-upload")?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengunggah...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Unggah Gambar
                          </>
                        )}
                      </Button>

                      {formData.cover_image && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleRemoveImage}
                          className="text-destructive"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Hapus
                        </Button>
                      )}
                    </div>

                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <p className="text-xs text-muted-foreground">
                      Unggah gambar sampul buku. Format yang didukung: JPG, PNG, GIF. Ukuran maksimal: 2MB.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detail Produk</CardTitle>
              <CardDescription>Masukkan informasi detail tentang buku</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bahasa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="Inggris">Inggris</SelectItem>
                      <SelectItem value="Jepang">Jepang</SelectItem>
                      <SelectItem value="Mandarin">Mandarin</SelectItem>
                      <SelectItem value="Arab">Arab</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page_count">Jumlah Halaman</Label>
                  <Input
                    id="page_count"
                    name="page_count"
                    type="number"
                    value={formData.page_count}
                    onChange={handleNumberChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publication_date">Tanggal Terbit</Label>
                  <Input
                    id="publication_date"
                    name="publication_date"
                    type="date"
                    value={formData.publication_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Kategori</CardTitle>
              <CardDescription>Pilih kategori dan subkategori untuk buku ini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className={errors.categories ? "text-destructive" : ""}>
                  Kategori <span className="text-destructive">*</span>
                </Label>
                {errors.categories && <p className="text-sm text-destructive">{errors.categories}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={formData.selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.selectedCategories.length > 0 && filteredSubcategories.length > 0 && (
                <div className="space-y-4">
                  <Label>Subkategori</Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {filteredSubcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`subcategory-${subcategory.id}`}
                          checked={formData.selectedSubcategories.includes(subcategory.id)}
                          onChange={() => handleSubcategoryChange(subcategory.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={`subcategory-${subcategory.id}`} className="text-sm font-normal cursor-pointer">
                          {subcategory.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Menyimpan..." : "Menambahkan..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
