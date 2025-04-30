import BookGrid from "@/components/book-grid"
import { getBestsellers } from "@/lib/actions"

export default async function BestsellersPage() {
  const books = await getBestsellers()

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Buku Terlaris</h1>

      <BookGrid books={books} emptyMessage="Tidak ada buku terlaris yang tersedia saat ini." />
    </div>
  )
}
