import type { Book } from "@/types/database"
import BookDisplay from "@/components/book-display"

interface BookGridProps {
  books: Book[]
  emptyMessage?: string
}

export default function BookGrid({ books, emptyMessage = "Tidak ada buku yang tersedia" }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {books.map((book) => (
        <BookDisplay
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
          price={book.price}
          coverImage={book.cover_image}
          discountPrice={book.discount_price}
        />
      ))}
    </div>
  )
}
