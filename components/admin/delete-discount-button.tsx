"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { deleteDiscount } from "@/lib/discount-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface DeleteDiscountButtonProps {
  id: string
  name: string
}

export default function DeleteDiscountButton({ id, name }: DeleteDiscountButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteDiscount(id)
      toast({
        title: "Diskon dihapus",
        description: `Diskon ${name} telah berhasil dihapus`,
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus diskon",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash className="mr-2 h-4 w-4" />
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Diskon</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus diskon <strong>{name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
