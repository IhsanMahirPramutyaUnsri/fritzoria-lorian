import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Hasil Pencarian</h1>
      <div className="text-center py-12">
        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-medium mb-2">Produk tidak tersedia</h2>
        <p className="text-muted-foreground mb-6">
          Saat ini kami sedang melakukan pembaruan pada katalog produk kami. Silakan kembali lagi nanti.
        </p>
        <Link href="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  )
}
