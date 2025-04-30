import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import AdminAuthProvider from "@/components/admin/auth-provider"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <main>{children}</main>
        </div>
      </div>
      <Toaster />
    </AdminAuthProvider>
  )
}
