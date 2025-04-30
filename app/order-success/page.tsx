import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function OrderSuccessPage() {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Pesanan Berhasil!</h1>
        <p className="text-muted-foreground mb-6">
          Terima kasih atas pesanan Anda. Kami telah mengirimkan email konfirmasi dengan detail pesanan Anda.
        </p>
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">Kembali ke Beranda</Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="outline" className="w-full">
              Lihat Pesanan Saya
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
