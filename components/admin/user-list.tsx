import Link from "next/link"
import { getAllUsers } from "@/lib/admin-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Pagination from "@/components/admin/pagination"
import { formatDate } from "@/lib/utils"

export default async function UserList({
  page = 1,
  search = "",
}: {
  page?: number
  search?: string
}) {
  const { users, count } = await getAllUsers(page, 10, search)
  const totalPages = Math.ceil(count / 10)

  // Function to get role badge color
  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "editor":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "customer":
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Function to get role display name
  const getRoleDisplayName = (role: string | null) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "editor":
        return "Editor"
      case "customer":
        return "Pelanggan"
      default:
        return "Pelanggan"
    }
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Tanggal Bergabung</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Tidak ada pengguna yang ditemukan
                </TableCell>
              </TableRow>
            )}
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name || "Tidak ada nama"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/users/${user.id}`}>
                    <Button variant="outline" size="icon" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={page} totalPages={totalPages} search={search} />
        </div>
      )}
    </div>
  )
}
