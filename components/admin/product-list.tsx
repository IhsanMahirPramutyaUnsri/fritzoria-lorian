import Link from "next/link"
import Image from "next/image"
import { getAllProducts } from "@/lib/admin-actions"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit } from "lucide-react"
import DeleteProductButton from "@/components/admin/delete-product-button"
import Pagination from "@/components/admin/pagination"

export default async function ProductList({
  page = 1,
  search = "",
}: {
  page?: number
  search?: string
}) {
  const { products, count } = await getAllProducts(page, 10, search)
  const totalPages = Math.ceil(count / 10)

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Gambar</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Harga</TableHead>
              <TableHead className="text-right">Stok</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Tidak ada produk yang ditemukan
                </TableCell>
              </TableRow>
            )}
            {products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-12 w-9 relative overflow-hidden rounded">
                    <Image
                      src={product.cover_image || "/placeholder.svg?height=120&width=90&query=book"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/admin/products/${product.id}`} className="hover:underline">
                    {product.title}
                  </Link>
                </TableCell>
                <TableCell>{product.author}</TableCell>
                <TableCell>
                  {product.categories && product.categories.length > 0
                    ? product.categories.map((cat: any) => cat.name).join(", ")
                    : "-"}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline" size="icon" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteProductButton id={product.id} title={product.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={page} totalPages={totalPages} search={search} />
        </div>
      )}
    </div>
  )
}
