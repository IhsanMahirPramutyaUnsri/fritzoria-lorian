import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { getAllCategories, getAllSubcategories } from "@/lib/admin-actions"
import ProductForm from "@/components/admin/product-form"

export default async function NewProductPage() {
  const categories = await getAllCategories()
  const subcategories = await getAllSubcategories()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
      </div>

      <ProductForm categories={categories} subcategories={subcategories} />
    </div>
  )
}
