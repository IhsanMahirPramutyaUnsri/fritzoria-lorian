import Link from "next/link"
import { BookOpen, BookText, MessageSquare, BookMarked, Sparkles, GraduationCap, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CategoriesPage() {
  // Category data structure
  const categories = [
    {
      name: "Buku Fiksi",
      slug: "fiction",
      icon: BookOpen,
      description:
        "Jelajahi koleksi buku fiksi kami termasuk novel, cerita pendek, romansa, fantasi, fiksi ilmiah, misteri & thriller, dan horor.",
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
      icon: BookText,
      description:
        "Temukan koleksi non-fiksi kami termasuk biografi, bisnis, pengembangan diri, sains & teknologi, sejarah, agama & spiritualitas, dan pendidikan & akademik.",
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
      icon: MessageSquare,
      description:
        "Telusuri koleksi komik dan novel grafis kami termasuk manga Jepang, novel grafis Barat, dan komik anak-anak.",
      subcategories: [
        { name: "Manga Jepang", slug: "japanese-manga" },
        { name: "Novel Grafis Barat", slug: "western-graphic-novels" },
        { name: "Komik Anak-anak", slug: "childrens-comics" },
      ],
    },
    {
      name: "Light Novel",
      slug: "light-novels",
      icon: BookMarked,
      description:
        "Jelajahi koleksi light novel kami termasuk petualangan, fantasi, fiksi ilmiah, slice of life, dan romansa.",
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
      icon: Sparkles,
      description:
        "Temukan buku sempurna untuk anak-anak termasuk buku cerita, buku pendidikan, dan buku papan & buku pop-up.",
      subcategories: [
        { name: "Buku Cerita Anak", slug: "childrens-story-books" },
        { name: "Buku Pendidikan Anak", slug: "childrens-educational-books" },
        { name: "Buku Papan & Buku Pop-up", slug: "board-popup-books" },
      ],
    },
    {
      name: "Pendidikan",
      slug: "education",
      icon: GraduationCap,
      description: "Telusuri buku pendidikan kami untuk SD, SMP, SMA, dan lainnya.",
      subcategories: [
        { name: "Sekolah Dasar", slug: "elementary-school" },
        { name: "Sekolah Menengah Pertama", slug: "middle-school" },
        { name: "Sekolah Menengah Atas", slug: "high-school" },
        { name: "Buku Pendidikan Anak", slug: "educational-childrens-books" },
        { name: "Kamus & Ensiklopedia", slug: "dictionaries-encyclopedias" },
      ],
    },
    {
      name: "Bahasa Asing",
      slug: "foreign-language",
      icon: Globe,
      description: "Jelajahi buku dalam berbagai bahasa untuk memperluas wawasan linguistik Anda.",
      subcategories: [],
    },
  ]

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Telusuri berdasarkan Kategori</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.slug} className="overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground mb-4">{category.description}</p>

              {category.subcategories.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Subkategori:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.slug}
                        href={`/categories/${category.slug}/${subcategory.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={`/categories/${category.slug}`}
                className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
              >
                Telusuri semua {category.name} →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
