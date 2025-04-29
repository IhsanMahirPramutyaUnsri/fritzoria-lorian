"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, Menu, X, Heart, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { cartItems } = useCart()

  useEffect(() => {
    const supabase = createClientSupabaseClient()

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setIsLoading(false)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Fritzoria</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className={`${pathname === "/" ? "text-primary" : "text-gray-600 hover:text-primary"}`}>
              Beranda
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 hover:text-primary">
                Kategori
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md p-4 w-[800px] z-50">
                <div className="grid grid-cols-4 gap-4 max-h-[500px] overflow-y-auto">
                  <div className="group">
                    <Link
                      href="/categories/fiction"
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                      </div>
                      <span className="flex-1 font-medium">Fiksi</span>
                    </Link>
                    <div className="pl-10 pb-2 mt-1 space-y-1 border-l-2 border-blue-100 ml-3 overflow-hidden">
                      <Link
                        href="/categories/fiction/romance"
                        className="block p-1.5 text-sm text-gray-600 hover:text-primary"
                      >
                        Novel Romantis
                      </Link>
                      <Link
                        href="/categories/fiction/mystery"
                        className="block p-1.5 text-sm text-gray-600 hover:text-primary"
                      >
                        Novel Misteri
                      </Link>
                      <Link
                        href="/categories/fiction/fantasy"
                        className="block p-1.5 text-sm text-gray-600 hover:text-primary"
                      >
                        Novel Fantasi
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/bestsellers"
              className={`${pathname === "/bestsellers" ? "text-primary" : "text-gray-600 hover:text-primary"}`}
            >
              Terlaris
            </Link>
            <Link
              href="/new-releases"
              className={`${pathname === "/new-releases" ? "text-primary" : "text-gray-600 hover:text-primary"}`}
            >
              Terbaru
            </Link>
            <Link
              href="/categories"
              className={`${pathname === "/categories" ? "text-primary" : "text-gray-600 hover:text-primary"}`}
            >
              Semua Kategori
            </Link>
          </nav>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Buka menu utama</span>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link href="/" className="mr-6 flex items-center md:hidden">
          <span className="text-xl font-bold text-primary">Fritzoria</span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <div className="w-full max-w-lg lg:max-w-xs relative">
            <form className="w-full" onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Cari..."
                  className="w-full rounded-md border border-gray-300 bg-white pl-8 py-2 md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
          <nav className="ml-4 flex items-center space-x-2">
            <Link href="/account" className="p-2 rounded-full hover:bg-gray-100">
              <User size={20} />
              <span className="sr-only">Akun</span>
            </Link>
            <Link href="/wishlist" className="p-2 rounded-full hover:bg-gray-100 relative">
              <Heart size={20} />
              <span className="sr-only">Wishlist</span>
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                2
              </span>
            </Link>
            <Link href="/cart" className="p-2 rounded-full hover:bg-gray-100 relative">
              <ShoppingCart size={20} />
              <span className="sr-only">Keranjang Belanja</span>
              {cartItems.length > 0 && (
                <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="space-y-1 px-2 pb-3 pt-2">
          <form className="mb-2" onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Cari..."
                className="w-full rounded-md border border-gray-300 bg-white pl-8 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-blue-50 hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Beranda
          </Link>
          <Link
            href="/categories"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-blue-50 hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Kategori
          </Link>
          <Link
            href="/bestsellers"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-blue-50 hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Terlaris
          </Link>
          <Link
            href="/new-releases"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-blue-50 hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Terbaru
          </Link>
        </div>
      </div>
    </header>
  )
}
