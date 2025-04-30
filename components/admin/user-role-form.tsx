"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Save } from "lucide-react"
import { updateUserRole, updateUserPermissions } from "@/lib/admin-actions"

interface UserRoleFormProps {
  user: any
  roles: { id: string; name: string; description: string }[]
  permissions: { id: string; name: string; description: string }[]
}

export default function UserRoleForm({ user, roles, permissions }: UserRoleFormProps) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState(user.role || "customer")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user.permissions || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId])
    } else {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Update user role
      await updateUserRole(user.id, selectedRole)

      // Update user permissions
      await updateUserPermissions(user.id, selectedPermissions)

      toast({
        title: "Peran pengguna diperbarui",
        description: "Peran dan izin pengguna telah berhasil diperbarui",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Gagal memperbarui peran pengguna",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat memperbarui peran pengguna",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pengguna</CardTitle>
            <CardDescription>Detail pengguna yang tidak dapat diubah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-muted-foreground">Nama</Label>
                <p className="font-medium">{user.full_name || "Tidak ada nama"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">ID Pengguna</Label>
                <p className="font-medium text-sm font-mono">{user.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tanggal Bergabung</Label>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peran Pengguna</CardTitle>
            <CardDescription>Tetapkan peran untuk pengguna ini</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value={role.id} id={`role-${role.id}`} />
                  <div className="grid gap-1.5">
                    <Label htmlFor={`role-${role.id}`} className="font-medium">
                      {role.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Izin Khusus</CardTitle>
            <CardDescription>
              Tetapkan izin khusus untuk pengguna ini. Izin ini akan mengesampingkan izin peran default.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3 space-y-0">
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor={`permission-${permission.id}`} className="font-medium">
                      {permission.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/users")} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
