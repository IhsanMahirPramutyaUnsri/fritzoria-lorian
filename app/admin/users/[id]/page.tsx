import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { getUserById, getRoles, getPermissions } from "@/lib/admin-actions"
import UserRoleForm from "@/components/admin/user-role-form"

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id)

  if (!user) {
    notFound()
  }

  const roles = await getRoles()
  const permissions = await getPermissions()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Pengguna</h1>
      </div>

      <UserRoleForm user={user} roles={roles} permissions={permissions} />
    </div>
  )
}
