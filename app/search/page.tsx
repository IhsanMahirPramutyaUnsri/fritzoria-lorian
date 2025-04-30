import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search } from "lucide-react"
import BookGrid from "@/components/book-grid"
import { searchBooks } from "@/lib/actions"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""
  const books = query ? await searchBooks(query) : []

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Hasil Pencarian: {query}</h1>

      {query ? (
        <BookGrid
          books={books}
          emptyMessage={`Tidak ada buku yang ditemukan untuk "${query}". Silakan coba kata kunci lain.`}
        />
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">Masukkan kata kunci pencarian</h2>
          <p className="text-muted-foreground mb-6">
            Gunakan kotak pencarian di atas untuk menemukan buku yang Anda cari.
          </p>
          <Link href="/">
            <Button>Kembali ke Beranda</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
