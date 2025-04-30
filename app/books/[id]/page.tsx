import { notFound } from "next/navigation"
import Image from "next/image"
import { getBookById } from "@/lib/actions"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"
import AddToCartButton from "@/components/add-to-cart-button"

export default async function BookPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id)

  if (!book) {
    notFound()
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Book Cover */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={book.cover_image || "/placeholder.svg?height=600&width=400&query=book cover"}
              alt={book.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Book Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl mb-4">{book.author}</p>

          <div className="flex items-center mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5"
                  fill={star <= 4 ? "currentColor" : "none"}
                  stroke={star <= 4 ? "none" : "currentColor"}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">(4.0)</span>
          </div>

          <div className="mb-6">
            <span className="text-2xl font-bold">{formatCurrency(book.price)}</span>
          </div>

          <div className="prose prose-blue max-w-none mb-6">
            <p>{book.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Penerbit</h3>
              <p>{book.publisher || "Tidak tersedia"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tanggal Terbit</h3>
              <p>{book.publication_date ? formatDate(book.publication_date) : "Tidak tersedia"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">ISBN</h3>
              <p>{book.isbn || "Tidak tersedia"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Bahasa</h3>
              <p>{book.language || "Tidak tersedia"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Jumlah Halaman</h3>
              <p>{book.page_count || "Tidak tersedia"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Stok</h3>
              <p>{book.stock > 0 ? `${book.stock} tersedia` : "Habis"}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <AddToCartButton bookId={book.id} className="flex-1" />
            <Button variant="outline" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Tambahkan ke wishlist</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
