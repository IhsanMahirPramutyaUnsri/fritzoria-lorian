"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UserSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const [search, setSearch] = useState(defaultValue)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setSearch(defaultValue)
  }, [defaultValue])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (search) {
      router.push(`${pathname}?search=${encodeURIComponent(search)}`)
    } else {
      router.push(pathname)
    }
  }

  const clearSearch = () => {
    setSearch("")
    router.push(pathname)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Cari pengguna berdasarkan nama atau email..."
        className="pl-10 pr-10"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </Button>
      )}
    </form>
  )
}
