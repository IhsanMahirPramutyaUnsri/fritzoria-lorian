import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart } from "lucide-react"
import BookGrid from "@/components/book-grid"

export default function WishlistPage() {
  // In a real application, we would fetch the user's wishlist
  // For now, we'll just show an empty state
  const books = []

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Wishlist Anda</h1>

      {books.length > 0 ? (
        <BookGrid books={books} />
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">Wishlist Anda kosong</h2>
          <p className="text-muted-foreground mb-6">Tambahkan buku ke wishlist Anda untuk melihatnya di sini.</p>
          <Link href="/categories">
            <Button>Jelajahi Buku</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
