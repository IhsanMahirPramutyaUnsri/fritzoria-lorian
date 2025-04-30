import BookGrid from "@/components/book-grid"
import { getNewReleases } from "@/lib/actions"

export default async function NewReleasesPage() {
  const books = await getNewReleases()

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Buku Terbaru</h1>

      <BookGrid books={books} emptyMessage="Tidak ada buku terbaru yang tersedia saat ini." />
    </div>
  )
}
