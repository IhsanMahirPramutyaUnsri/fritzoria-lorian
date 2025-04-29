import Image from "next/image"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase"
import {
  BookOpen,
  BookText,
  MessageSquare,
  BookMarked,
  Bookmark,
  Sparkles,
  GraduationCap,
  Globe,
  ChevronRight,
  ShoppingCart,
  TruckIcon,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Carousel from "@/components/carousel"
import CategoryCard from "@/components/category-card"
import BookDisplay from "@/components/book-display"
import type { Book } from "@/types/database"

async function getHomePageData() {
  const supabase = createServerSupabaseClient()

  // Get featured books
  const { data: featuredBooks } = await supabase
    .from("books")
    .select(`
      id,
      title,
      author,
      price,
      discount_price,
      cover_image,
      description
    `)
    .order("created_at", { ascending: false })
    .limit(6)

  return {
    featuredBooks: featuredBooks as Book[],
  }
}

export default async function Home() {
  const { featuredBooks } = await getHomePageData()

  const categories = [
    { name: "Fiksi", slug: "fiction", icon: BookOpen },
    { name: "Non-Fiksi", slug: "non-fiction", icon: BookText },
    { name: "Komik", slug: "comics", icon: MessageSquare },
    { name: "Novel", slug: "novels", icon: BookMarked },
    { name: "Light Novel", slug: "light-novels", icon: Bookmark },
    { name: "Buku Anak", slug: "children", icon: Sparkles },
    { name: "Pendidikan", slug: "education", icon: GraduationCap },
    { name: "Buku Bahasa Asing", slug: "foreign-language", icon: Globe },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Carousel Section */}
      <section className="py-6">
        <div className="container px-0 md:px-4">
          <Carousel>
            {/* Slide 1: Seasonal Sale */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
              <Image
                src="/seasonal-sale-books.png"
                alt="Seasonal Sale"
                fill
                className="object-cover brightness-[0.85]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex flex-col justify-center px-8 md:px-16">
                <div className="max-w-lg">
                  <span className="inline-block bg-yellow-500 text-primary font-bold px-4 py-1 rounded-full text-sm mb-4">
                    DISKON HINGGA 50%
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Seasonal Sale is Here!</h2>
                  <p className="text-white/90 text-lg mb-6">Nikmati diskon hingga 50% untuk koleksi terbaru kami.</p>
                  <Link href="/sale">
                    <Button className="bg-white text-primary hover:bg-white/90">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Belanja Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Slide 2: Featured Products */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
              <Image
                src="/featured-books-collection.png"
                alt="Featured Products"
                fill
                className="object-cover brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A237E]/80 to-transparent flex flex-col justify-center px-8 md:px-16">
                <div className="max-w-lg">
                  <span className="inline-block bg-white text-primary font-bold px-4 py-1 rounded-full text-sm mb-4">
                    PILIHAN TERBAIK
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Produk Terfavorit, Khusus untuk Anda
                  </h2>
                  <p className="text-white/90 text-lg mb-6">Temukan item favorit pilihan pelanggan di sini.</p>
                  <Link href="/bestsellers">
                    <Button className="bg-white text-primary hover:bg-white/90">
                      <Star className="mr-2 h-4 w-4" />
                      Lihat Koleksi
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Slide 3: Free Shipping */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
              <Image
                src="/free-shipping-promo.png"
                alt="Free Shipping"
                fill
                className="object-cover brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A237E]/80 to-transparent flex flex-col justify-center px-8 md:px-16">
                <div className="max-w-lg">
                  <span className="inline-block bg-green-500 text-white font-bold px-4 py-1 rounded-full text-sm mb-4">
                    GRATIS ONGKIR
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Gratis Ongkir untuk Pembelian di Atas Rp300.000!
                  </h2>
                  <p className="text-white/90 text-lg mb-6">Belanja lebih banyak, hemat lebih banyak.</p>
                  <Link href="/categories">
                    <Button className="bg-white text-primary hover:bg-white/90">
                      <TruckIcon className="mr-2 h-4 w-4" />
                      Mulai Belanja
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Kategori</h2>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
            >
              Lihat Semua Kategori
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} name={category.name} slug={category.slug} icon={category.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Buku Pilihan</h2>
            <p className="text-muted-foreground mt-1">Koleksi terbaik kami dengan sampul yang menarik</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {featuredBooks.map((book) => (
              <BookDisplay
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                price={book.price}
                discountPrice={book.discount_price || undefined}
                coverImage={book.cover_image || "/abstract-book-cover.png"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Carousel Section */}
      <section className="bg-gray-50 py-12">
        <div className="container">
          <div className="relative overflow-hidden rounded-lg">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 flex flex-col items-center gap-8 p-8 text-white transition-opacity duration-500 bg-primary opacity-100 z-10 md:flex-row">
                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Gabung Program Keanggotaan Kami</h2>
                  <p className="max-w-[600px] text-white/80">
                    Dapatkan diskon eksklusif, akses awal ke buku baru, dan acara khusus. Bergabunglah hari ini dan
                    terima diskon 10% untuk pembelian pertama Anda.
                  </p>
                  <Link href="/membership">
                    <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                      Gabung Sekarang
                    </Button>
                  </Link>
                </div>
                <div className="flex-1">
                  <Image
                    src="/sleek-digital-membership.png"
                    alt="Membership Card"
                    width={400}
                    height={300}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Indicator dots */}
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
              <button className="h-2 w-6 rounded-full bg-white transition-all" aria-label="Go to slide 1"></button>
              <button
                className="h-2 w-2 rounded-full bg-white/50 hover:bg-white/80 transition-all"
                aria-label="Go to slide 2"
              ></button>
              <button
                className="h-2 w-2 rounded-full bg-white/50 hover:bg-white/80 transition-all"
                aria-label="Go to slide 3"
              ></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
