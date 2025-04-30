"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import type { Discount, DiscountType } from "@/types/database"

export async function getDiscountTypes(): Promise<DiscountType[]> {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("discount_types").select("*").order("name")

  return data || []
}

export async function getDiscounts(): Promise<Discount[]> {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase
    .from("discounts")
    .select(`
      *,
      discount_type:discount_type_id(*)
    `)
    .order("created_at", { ascending: false })

  return data || []
}

export async function getActiveDiscounts(): Promise<Discount[]> {
  const supabase = createServerSupabaseClient()
  const now = new Date().toISOString()

  const { data } = await supabase
    .from("discounts")
    .select(`
      *,
      discount_type:discount_type_id(*)
    `)
    .eq("is_active", true)
    .lte("start_date", now)
    .or(`end_date.gt.${now},end_date.is.null`)
    .order("created_at", { ascending: false })

  return data || []
}

export async function getDiscountById(id: string): Promise<Discount | null> {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase
    .from("discounts")
    .select(`
      *,
      discount_type:discount_type_id(*),
      products:discount_products(books:book_id(*)),
      categories:discount_categories(categories:category_id(*)),
      subcategories:discount_subcategories(subcategories:subcategory_id(*))
    `)
    .eq("id", id)
    .single()

  return data
}

export async function getDiscountByCode(code: string): Promise<Discount | null> {
  const supabase = createServerSupabaseClient()
  const now = new Date().toISOString()

  const { data } = await supabase
    .from("discounts")
    .select(`
      *,
      discount_type:discount_type_id(*),
      products:discount_products(books:book_id(*)),
      categories:discount_categories(categories:category_id(*)),
      subcategories:discount_subcategories(subcategories:subcategory_id(*))
    `)
    .eq("code", code)
    .eq("is_active", true)
    .lte("start_date", now)
    .or(`end_date.gt.${now},end_date.is.null`)
    .single()

  return data
}

export async function createDiscount(discount: Omit<Discount, "id" | "created_at" | "updated_at" | "uses_count">) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("discounts")
    .insert({
      ...discount,
      uses_count: 0,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateDiscount(id: string, discount: Partial<Discount>) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("discounts")
    .update({
      ...discount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteDiscount(id: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("discounts").delete().eq("id", id)

  if (error) throw new Error(error.message)
  return true
}

export async function addProductToDiscount(discountId: string, bookId: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("discount_products").insert({
    discount_id: discountId,
    book_id: bookId,
  })

  if (error) throw new Error(error.message)
  return true
}

export async function removeProductFromDiscount(discountId: string, bookId: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from("discount_products")
    .delete()
    .eq("discount_id", discountId)
    .eq("book_id", bookId)

  if (error) throw new Error(error.message)
  return true
}

export async function addCategoryToDiscount(discountId: string, categoryId: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("discount_categories").insert({
    discount_id: discountId,
    category_id: categoryId,
  })

  if (error) throw new Error(error.message)
  return true
}

export async function removeCategoryFromDiscount(discountId: string, categoryId: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from("discount_categories")
    .delete()
    .eq("discount_id", discountId)
    .eq("category_id", categoryId)

  if (error) throw new Error(error.message)
  return true
}

export async function addSubcategoryToDiscount(discountId: string, subcategoryId: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("discount_subcategories").insert({
    discount_id: discountId,
    subcategory_id: subcategoryId,
  })

  if (error) throw new Error(error.message)
  return true
}

export async function removeSubcategoryFromDiscount(discountId: string, subcategoryId: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from("discount_subcategories")
    .delete()
    .eq("discount_id", discountId)
    .eq("subcategory_id", subcategoryId)

  if (error) throw new Error(error.message)
  return true
}

export async function useDiscount(userId: string, discountId: string, orderId: string | null = null) {
  const supabase = createServerSupabaseClient()

  // Increment the uses_count in the discounts table
  const { error: updateError } = await supabase
    .from("discounts")
    .update({
      uses_count: supabase.rpc("increment", { row_id: discountId, increment_by: 1 }),
    })
    .eq("id", discountId)

  if (updateError) throw new Error(updateError.message)

  // Record the usage in user_discounts table
  const { error: insertError } = await supabase.from("user_discounts").insert({
    user_id: userId,
    discount_id: discountId,
    order_id: orderId,
  })

  if (insertError) throw new Error(insertError.message)

  return true
}

export async function validateDiscount(
  code: string,
  userId: string,
  cartItems: any[],
  subtotal: number,
): Promise<{
  valid: boolean
  discount: Discount | null
  discountAmount: number
  message?: string
}> {
  const discount = await getDiscountByCode(code)

  if (!discount) {
    return { valid: false, discount: null, discountAmount: 0, message: "Kode diskon tidak valid" }
  }

  // Check if discount has reached max uses
  if (discount.max_uses !== null && discount.uses_count >= discount.max_uses) {
    return { valid: false, discount, discountAmount: 0, message: "Kode diskon sudah mencapai batas penggunaan" }
  }

  // Check minimum purchase amount
  if (subtotal < discount.min_purchase_amount) {
    return {
      valid: false,
      discount,
      discountAmount: 0,
      message: `Minimum pembelian untuk diskon ini adalah ${formatCurrency(discount.min_purchase_amount)}`,
    }
  }

  // Check minimum quantity
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  if (totalQuantity < discount.min_quantity) {
    return {
      valid: false,
      discount,
      discountAmount: 0,
      message: `Minimum ${discount.min_quantity} item untuk diskon ini`,
    }
  }

  // Check if user has already used this discount (if it's a one-time use discount)
  if (userId) {
    const supabase = createServerSupabaseClient()
    const { data: userDiscounts } = await supabase
      .from("user_discounts")
      .select("*")
      .eq("user_id", userId)
      .eq("discount_id", discount.id)

    if (userDiscounts && userDiscounts.length > 0) {
      return { valid: false, discount, discountAmount: 0, message: "Anda sudah menggunakan kode diskon ini" }
    }
  }

  // Calculate discount amount based on type
  let discountAmount = 0

  if (discount.discount_type?.name === "percentage") {
    discountAmount = (subtotal * discount.value) / 100
  } else if (discount.discount_type?.name === "fixed_amount") {
    discountAmount = discount.value
  }

  // Ensure discount doesn't exceed the subtotal
  discountAmount = Math.min(discountAmount, subtotal)

  return { valid: true, discount, discountAmount }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
