import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ProductList from "@/components/admin/product-list"
import ProductListSkeleton from "@/components/admin/product-list-skeleton"
import ProductSearch from "@/components/admin/product-search"

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const search = searchParams.search || ""

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Produk</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <ProductSearch defaultValue={search} />
      </div>

      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList page={page} search={search} />
      </Suspense>
    </div>
  )
}
