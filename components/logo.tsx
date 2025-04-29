import Link from "next/link"
import { BookOpen } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "h-6 w-6",
      icon: "h-4 w-4",
    },
    md: {
      container: "h-8 w-8",
      icon: "h-5 w-5",
    },
    lg: {
      container: "h-10 w-10",
      icon: "h-6 w-6",
    },
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className={`relative ${sizeClasses[size].container} overflow-hidden rounded-full bg-primary`}>
        <BookOpen
          className={`absolute ${sizeClasses[size].icon} text-primary-foreground`}
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
      </div>
      {showText && <span className={`font-bold ${textSizeClasses[size]}`}>BookStore</span>}
    </Link>
  )
}
