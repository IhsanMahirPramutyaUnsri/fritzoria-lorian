import { notFound } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  BookText,
  MessageSquare,
  BookMarked,
  Sparkles,
  GraduationCap,
  Globe,
  BookOpenCheck,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BookGrid from "@/components/book-grid"
import { getBooksByCategory, getSubcategories } from "@/lib/actions"

// Define the category data structure
const categories = [
  {
    name: "Buku Fiksi",
    slug: "fiction",
    icon: BookOpen,
    description:
      "Jelajahi koleksi buku fiksi kami termasuk novel, cerita pendek, romansa, fantasi, fiksi ilmiah, misteri & thriller, dan horor.",
    subcategories: [
      { name: "Novel", slug: "novels", description: "Narasi prosa fiksi panjang" },
      {
        name: "Cerita Pendek",
        slug: "short-stories",
        description: "Karya fiksi singkat yang dapat dibaca dalam sekali duduk",
      },
      { name: "Romansa", slug: "romance", description: "Cerita yang berpusat pada hubungan romantis" },
      { name: "Fantasi", slug: "fantasy", description: "Fiksi dengan elemen magis atau supernatural" },
      {
        name: "Fiksi Ilmiah (Sci-Fi)",
        slug: "sci-fi",
        description: "Fiksi berdasarkan penemuan ilmiah, teknologi, dan eksplorasi luar angkasa",
      },
      {
        name: "Misteri & Thriller",
        slug: "mystery-thriller",
        description: "Cerita menegangkan yang melibatkan kejahatan, misteri, atau spionase",
      },
      {
        name: "Horor",
        slug: "horror",
        description: "Cerita yang dirancang untuk menakuti, mengejutkan, atau mengagetkan pembaca",
      },
    ],
  },
  {
    name: "Buku Non-Fiksi",
    slug: "non-fiction",
    icon: BookText,
    description:
      "Temukan koleksi non-fiksi kami termasuk biografi, bisnis, pengembangan diri, sains & teknologi, sejarah, agama & spiritualitas, dan pendidikan & akademik.",
    subcategories: [
      {
        name: "Biografi & Autobiografi",
        slug: "biographies-autobiographies",
        description: "Kisah nyata tentang kehidupan seseorang",
      },
      {
        name: "Bisnis & Manajemen",
        slug: "business-management",
        description: "Buku tentang strategi bisnis, manajemen, dan kewirausahaan",
      },
      {
        name: "Pengembangan Diri",
        slug: "self-help",
        description: "Buku yang berfokus pada pengembangan dan peningkatan diri",
      },
      {
        name: "Sains & Teknologi",
        slug: "science-technology",
        description: "Buku tentang penemuan ilmiah dan kemajuan teknologi",
      },
      { name: "Sejarah", slug: "history", description: "Buku tentang peristiwa masa lalu dan tokoh sejarah" },
      {
        name: "Agama & Spiritualitas",
        slug: "religion-spirituality",
        description: "Buku yang mengeksplorasi topik agama dan spiritual",
      },
      { name: "Pendidikan & Akademik", slug: "education-academic", description: "Sumber daya pendidikan dan akademik" },
    ],
  },
  {
    name: "Komik & Novel Grafis",
    slug: "comics-graphic-novels",
    icon: MessageSquare,
    description:
      "Telusuri koleksi komik dan novel grafis kami termasuk manga Jepang, novel grafis Barat, dan komik anak-anak.",
    subcategories: [
      {
        name: "Manga Jepang",
        slug: "japanese-manga",
        description: "Komik atau novel grafis yang berasal dari Jepang",
      },
      {
        name: "Novel Grafis Barat",
        slug: "western-graphic-novels",
        description: "Komik atau novel grafis dari negara-negara Barat",
      },
      { name: "Komik Anak-anak", slug: "childrens-comics", description: "Komik yang dirancang untuk anak-anak" },
    ],
  },
  {
    name: "Light Novel",
    slug: "light-novels",
    icon: BookMarked,
    description:
      "Jelajahi koleksi light novel kami termasuk petualangan, fantasi, fiksi ilmiah, slice of life, dan romansa.",
    subcategories: [
      {
        name: "Petualangan",
        slug: "light-novel-adventure",
        description: "Light novel yang berfokus pada perjalanan dan petualangan yang menarik",
      },
      {
        name: "Fantasi",
        slug: "light-novel-fantasy",
        description: "Light novel dengan elemen magis atau supernatural",
      },
      { name: "Fiksi Ilmiah", slug: "light-novel-sci-fi", description: "Light novel dengan tema fiksi ilmiah" },
      {
        name: "Slice of Life",
        slug: "light-novel-slice-of-life",
        description: "Light novel yang menggambarkan pengalaman sehari-hari",
      },
      {
        name: "Romansa",
        slug: "light-novel-romance",
        description: "Light novel yang berpusat pada hubungan romantis",
      },
    ],
  },
  {
    name: "Buku Anak-anak",
    slug: "childrens-books",
    icon: Sparkles,
    description:
      "Temukan buku sempurna untuk anak-anak termasuk buku cerita, buku pendidikan, dan buku papan & buku pop-up.",
    subcategories: [
      { name: "Buku Cerita Anak", slug: "childrens-story-books", description: "Cerita fiksi untuk anak-anak" },
      {
        name: "Buku Pendidikan Anak",
        slug: "childrens-educational-books",
        description: "Buku yang dirancang untuk mendidik anak-anak",
      },
      {
        name: "Buku Papan & Buku Pop-up",
        slug: "board-popup-books",
        description: "Buku tahan lama untuk anak kecil dan buku pop-up interaktif",
      },
    ],
  },
  {
    name: "Pendidikan",
    slug: "education",
    icon: GraduationCap,
    description: "Telusuri buku pendidikan kami untuk SD, SMP, SMA, dan lainnya.",
    subcategories: [
      {
        name: "Sekolah Dasar",
        slug: "elementary-school",
        description: "Materi pendidikan untuk siswa sekolah dasar",
      },
      { name: "Sekolah Menengah Pertama", slug: "middle-school", description: "Materi pendidikan untuk siswa SMP" },
      { name: "Sekolah Menengah Atas", slug: "high-school", description: "Materi pendidikan untuk siswa SMA" },
      {
        name: "Buku Pendidikan Anak",
        slug: "educational-childrens-books",
        description: "Buku yang dirancang untuk mendidik anak-anak",
      },
      {
        name: "Kamus & Ensiklopedia",
        slug: "dictionaries-encyclopedias",
        description: "Buku referensi yang memberikan informasi tentang kata-kata, subjek, dan topik",
      },
    ],
  },
  {
    name: "Bahasa Asing",
    slug: "foreign-language",
    icon: Globe,
    description: "Jelajahi buku dalam berbagai bahasa untuk memperluas wawasan linguistik Anda.",
    subcategories: [],
  },
  {
    name: "Terlaris",
    slug: "bestsellers",
    icon: BookOpenCheck,
    description: "Temukan buku-buku paling populer dan terlaris kami dari semua kategori.",
    subcategories: [],
  },
]

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((cat) => cat.slug === params.slug)

  if (!category) {
    notFound()
  }

  const CategoryIcon = category.icon
  const books = await getBooksByCategory(params.slug)
  const subcategories = await getSubcategories(params.slug)

  return (
    <div className="container py-12">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">
          Kategori
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{category.name}</span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-md">
          <CategoryIcon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>

      <p className="text-lg text-muted-foreground mb-8 max-w-3xl">{category.description}</p>

      {subcategories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Telusuri berdasarkan Subkategori</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subcategories.map((subcategory) => (
              <Card key={subcategory.slug} className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-2">{subcategory.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{subcategory.description}</p>
                  <Link href={`/categories/${category.slug}/${subcategory.slug}`}>
                    <Button variant="outline" className="w-full">
                      Telusuri {subcategory.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Buku {category.name}</h2>
        <BookGrid books={books} emptyMessage={`Tidak ada buku ${category.name} yang tersedia saat ini.`} />
      </div>

      <div className="text-center mt-8">
        <p className="text-muted-foreground mb-4">Mencari sesuatu yang spesifik?</p>
        <Link href="/search">
          <Button>Cari Semua Produk</Button>
        </Link>
      </div>
    </div>
  )
}
