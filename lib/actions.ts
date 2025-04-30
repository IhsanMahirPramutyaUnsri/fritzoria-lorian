"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import type { Book, Category, Subcategory } from "@/types/database"

export async function getBooksByCategory(categorySlug: string, limit = 10): Promise<Book[]> {
  const supabase = createServerSupabaseClient()

  const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", categorySlug).single()

  if (!categoryData) return []

  const { data: books } = await supabase
    .from("book_categories")
    .select(`
      book_id,
      books:book_id(
        id,
        title,
        author,
        publisher,
        isbn,
        description,
        price,
        discount_price,
        stock,
        cover_image,
        page_count,
        language,
        publication_date,
        created_at,
        updated_at
      )
    `)
    .eq("category_id", categoryData.id)
    .limit(limit)

  if (!books) return []

  return books.map((item) => item.books) as Book[]
}

export async function getBooksBySubcategory(
  categorySlug: string,
  subcategorySlug: string,
  limit = 10,
): Promise<Book[]> {
  const supabase = createServerSupabaseClient()

  const { data: subcategoryData } = await supabase
    .from("subcategories")
    .select("id")
    .eq("slug", subcategorySlug)
    .single()

  if (!subcategoryData) return []

  const { data: books } = await supabase
    .from("book_subcategories")
    .select(`
      book_id,
      books:book_id(
        id,
        title,
        author,
        publisher,
        isbn,
        description,
        price,
        discount_price,
        stock,
        cover_image,
        page_count,
        language,
        publication_date,
        created_at,
        updated_at
      )
    `)
    .eq("subcategory_id", subcategoryData.id)
    .limit(limit)

  if (!books) return []

  return books.map((item) => item.books) as Book[]
}

export async function getBookById(id: string): Promise<Book | null> {
  const supabase = createServerSupabaseClient()

  const { data: book } = await supabase
    .from("books")
    .select(`
      id,
      title,
      author,
      publisher,
      isbn,
      description,
      price,
      discount_price,
      stock,
      cover_image,
      page_count,
      language,
      publication_date,
      created_at,
      updated_at
    `)
    .eq("id", id)
    .single()

  if (!book) return null

  return book as Book
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabaseClient()

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return categories || []
}

export async function getSubcategories(categorySlug: string): Promise<Subcategory[]> {
  const supabase = createServerSupabaseClient()

  const { data: category } = await supabase.from("categories").select("id").eq("slug", categorySlug).single()

  if (!category) return []

  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", category.id)
    .order("name")

  return subcategories || []
}

export async function searchBooks(query: string, limit = 10): Promise<Book[]> {
  const supabase = createServerSupabaseClient()

  const { data: books } = await supabase
    .from("books")
    .select("*")
    .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(limit)

  return books || []
}

export async function getFeaturedBooks(limit = 8): Promise<Book[]> {
  const supabase = createServerSupabaseClient()

  const { data: books } = await supabase.from("books").select("*").not("discount_price", "is", null).limit(limit)

  return books || []
}

export async function getNewReleases(limit = 8): Promise<Book[]> {
  const supabase = createServerSupabaseClient()

  const { data: books } = await supabase
    .from("books")
    .select("*")
    .order("publication_date", { ascending: false })
    .limit(limit)

  return books || []
}

export async function getBestsellers(limit = 8): Promise<Book[]> {
  const supabase = createServerSupabaseClient()

  // In a real application, this would be based on sales data
  // For now, we'll just return some books
  const { data: books } = await supabase.from("books").select("*").limit(limit)

  return books || []
}
