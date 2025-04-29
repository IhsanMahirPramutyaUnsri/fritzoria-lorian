import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Fritzoria</h3>
            <p className="text-sm opacity-80">
              Toko online terlengkap untuk buku, alat tulis, dan lainnya. Temukan dunia pengetahuan dan kreativitas
              bersama Fritzoria.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-white hover:opacity-80">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-white hover:opacity-80">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white hover:opacity-80">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Tentang Kami</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:underline">
                  Profil Perusahaan
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:underline">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:underline">
                  Pers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Layanan Pelanggan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:underline">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:underline">
                  Pengiriman & Pengembalian
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Langganan</h3>
            <p className="mb-4 text-sm opacity-80">
              Berlangganan newsletter kami untuk mendapatkan informasi terbaru dan promosi.
            </p>
            <form className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Alamat email Anda"
                className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
              <Button
                type="submit"
                className="rounded-md bg-white px-3 py-2 text-sm font-medium text-primary hover:bg-white/90"
              >
                Berlangganan
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} Fritzoria. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
