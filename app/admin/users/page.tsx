import { Suspense } from "react"
import UserList from "@/components/admin/user-list"
import UserListSkeleton from "@/components/admin/user-list-skeleton"
import UserSearch from "@/components/admin/user-search"

export default function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const search = searchParams.search || ""

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Pengguna</h1>
      </div>

      <div className="mb-6">
        <UserSearch defaultValue={search} />
      </div>

      <Suspense fallback={<UserListSkeleton />}>
        <UserList page={page} search={search} />
      </Suspense>
    </div>
  )
}
