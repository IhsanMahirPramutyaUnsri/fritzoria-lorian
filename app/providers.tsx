"use client"

import type { ReactNode } from "react"
import { CartProvider } from "@/hooks/use-cart"

export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
