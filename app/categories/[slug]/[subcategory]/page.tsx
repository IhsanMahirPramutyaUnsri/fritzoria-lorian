import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Define the category data structure (same as in the category page)
const categories = [
  {
    name: "Buku Fiksi",
    slug: "fiction",
    subcategories: [
      { name: "Novel", slug: "novels" },
      { name: "Cerita Pendek", slug: "short-stories" },
      { name: "Romansa", slug: "romance" },
      { name: "Fantasi", slug: "fantasy" },
      { name: "Fiksi Ilmiah (Sci-Fi)", slug: "sci-fi" },
      { name: "Misteri & Thriller", slug: "mystery-thriller" },
      { name: "Horor", slug: "horror" },
    ],
  },
  {
    name: "Buku Non-Fiksi",
    slug: "non-fiction",
    subcategories: [
      { name: "Biografi & Autobiografi", slug: "biographies-autobiographies" },
      { name: "Bisnis & Manajemen", slug: "business-management" },
      { name: "Pengembangan Diri", slug: "self-help" },
      { name: "Sains & Teknologi", slug: "science-technology" },
      { name: "Sejarah", slug: "history" },
      { name: "Agama & Spiritualitas", slug: "religion-spirituality" },
      { name: "Pendidikan & Akademik", slug: "education-academic" },
    ],
  },
  {
    name: "Komik & Novel Grafis",
    slug: "comics-graphic-novels",
    subcategories: [
      { name: "Manga Jepang", slug: "japanese-manga" },
      { name: "Novel Grafis Barat", slug: "western-graphic-novels" },
      { name: "Komik Anak-anak", slug: "childrens-comics" },
    ],
  },
  {
    name: "Light Novel",
    slug: "light-novels",
    subcategories: [
      { name: "Petualangan", slug: "light-novel-adventure" },
      { name: "Fantasi", slug: "light-novel-fantasy" },
      { name: "Fiksi Ilmiah", slug: "light-novel-sci-fi" },
      { name: "Slice of Life", slug: "light-novel-slice-of-life" },
      { name: "Romansa", slug: "light-novel-romance" },
    ],
  },
  {
    name: "Buku Anak-anak",
    slug: "childrens-books",
    subcategories: [
      { name: "Buku Cerita Anak", slug: "childrens-story-books" },
      { name: "Buku Pendidikan Anak", slug: "childrens-educational-books" },
      { name: "Buku Papan & Buku Pop-up", slug: "board-popup-books" },
    ],
  },
  {
    name: "Pendidikan",
    slug: "education",
    subcategories: [
      { name: "Sekolah Dasar", slug: "elementary-school" },
      { name: "Sekolah Menengah Pertama", slug: "middle-school" },
      { name: "Sekolah Menengah Atas", slug: "high-school" },
      { name: "Buku Pendidikan Anak", slug: "educational-childrens-books" },
      { name: "Kamus & Ensiklopedia", slug: "dictionaries-encyclopedias" },
    ],
  },
]

export default function SubcategoryPage({ params }: { params: { slug: string; subcategory: string } }) {
  const category = categories.find((cat) => cat.slug === params.slug)

  if (!category) {
    notFound()
  }

  const subcategory = category.subcategories.find((sub) => sub.slug === params.subcategory)

  if (!subcategory) {
    notFound()
  }

  return (
    <div className="container py-12">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">
          Kategori
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Link href={`/categories/${category.slug}`} className="text-sm text-muted-foreground hover:text-primary">
          {category.name}
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{subcategory.name}</span>
      </div>

      <h1 className="text-3xl font-bold mb-6">{subcategory.name}</h1>

      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Ini adalah placeholder untuk halaman subkategori {subcategory.name}. Produk dalam kategori ini akan
          ditampilkan di sini.
        </p>
      </div>
    </div>
  )
}
