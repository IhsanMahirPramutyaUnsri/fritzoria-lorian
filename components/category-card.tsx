import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface CategoryCardProps {
  name: string
  slug: string
  icon: LucideIcon
}

export default function CategoryCard({ name, slug, icon: Icon }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]"
    >
      <div className="w-12 h-12 mb-3 flex items-center justify-center text-primary">
        <Icon size={32} />
      </div>
      <h3 className="text-center text-sm font-medium">{name}</h3>
    </Link>
  )
}
