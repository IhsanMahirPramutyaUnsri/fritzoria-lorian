import Link from "next/link"
import { getDiscounts } from "@/lib/discount-actions"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Plus, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DeleteDiscountButton from "@/components/admin/delete-discount-button"

export default async function DiscountsPage() {
  const discounts = await getDiscounts()

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Kelola Diskon</h1>
        <Link href="/admin/discounts/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Diskon Baru
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {discounts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Belum ada diskon yang dibuat.</p>
            </CardContent>
          </Card>
        ) : (
          discounts.map((discount) => (
            <Card key={discount.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{discount.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Kode: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{discount.code}</span>
                    </CardDescription>
                  </div>
                  <Badge variant={discount.is_active ? "default" : "outline"}>
                    {discount.is_active ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipe Diskon</p>
                    <p>
                      {discount.discount_type?.name === "percentage"
                        ? `${discount.value}% off`
                        : `Rp ${discount.value.toLocaleString("id-ID")} off`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Periode</p>
                    <p>
                      {formatDate(discount.start_date)} -{" "}
                      {discount.end_date ? formatDate(discount.end_date) : "Tidak ada batas"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Penggunaan</p>
                    <p>
                      {discount.uses_count} {discount.max_uses ? `/ ${discount.max_uses}` : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <Link href={`/admin/discounts/${discount.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteDiscountButton id={discount.id} name={discount.name} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
