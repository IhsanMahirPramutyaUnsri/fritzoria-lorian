"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function getDashboardStats() {
  const supabase = createServerSupabaseClient()

  // Get total products
  const { count: totalProducts } = await supabase.from("books").select("*", { count: "exact", head: true })

  // Get new products this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: newProducts } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString())

  // Get total users
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  // Get new users this month
  const { count: newUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString())

  // Get total orders (placeholder - you'll need to create an orders table)
  const totalOrders = 0
  const newOrders = 0
  const totalRevenue = 0
  const monthlyRevenue = 0

  // Get top products (placeholder - you'll need to track sales)
  const topProducts = [
    {
      id: "1",
      title: "Bumi Manusia",
      author: "Pramoedya Ananta Toer",
      cover_image: "/books/bumi-manusia.png",
      sales: 24,
    },
    {
      id: "2",
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      cover_image: "/books/laskar-pelangi.png",
      sales: 18,
    },
    {
      id: "3",
      title: "Pulang",
      author: "Tere Liye",
      cover_image: "/books/pulang.png",
      sales: 15,
    },
  ]

  // Get recent orders (placeholder)
  const recentOrders = [
    {
      id: "ord-12345678",
      user_email: "customer1@example.com",
      total_amount: 250000,
      status: "completed",
    },
    {
      id: "ord-23456789",
      user_email: "customer2@example.com",
      total_amount: 180000,
      status: "processing",
    },
    {
      id: "ord-34567890",
      user_email: "customer3@example.com",
      total_amount: 320000,
      status: "pending",
    },
  ]

  return {
    totalProducts: totalProducts || 0,
    newProducts: newProducts || 0,
    totalUsers: totalUsers || 0,
    newUsers: newUsers || 0,
    totalOrders,
    newOrders,
    totalRevenue,
    monthlyRevenue,
    topProducts,
    recentOrders,
  }
}

export async function getAllProducts(page = 1, limit = 10, search = "") {
  const supabase = createServerSupabaseClient()

  const offset = (page - 1) * limit

  let query = supabase.from("books").select(
    `
      *,
      book_categories!inner(
        categories(id, name)
      )
    `,
    { count: "exact" },
  )

  if (search) {
    query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`)
  }

  const { data, count, error } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching products:", error)
    return { products: [], count: 0 }
  }

  // Process the data to extract categories
  const products = data.map((product: any) => {
    const categories = product.book_categories.map((bc: any) => bc.categories).filter(Boolean)

    return {
      ...product,
      categories,
      book_categories: undefined,
    }
  })

  return { products, count: count || 0 }
}

export async function getProductById(id: string) {
  const supabase = createServerSupabaseClient()

  const { data: product, error } = await supabase
    .from("books")
    .select(`
      *,
      book_categories(
        category_id,
        categories(id, name, slug)
      ),
      book_subcategories(
        subcategory_id,
        subcategories(id, name, slug, category_id)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  // Process the data to extract categories and subcategories
  const categories = product.book_categories.map((bc: any) => bc.categories).filter(Boolean)

  const subcategories = product.book_subcategories.map((bs: any) => bs.subcategories).filter(Boolean)

  return {
    ...product,
    categories,
    subcategories,
    book_categories: undefined,
    book_subcategories: undefined,
  }
}

export async function getAllCategories() {
  const supabase = createServerSupabaseClient()

  const { data: categories, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return categories
}

export async function getAllSubcategories() {
  const supabase = createServerSupabaseClient()

  const { data: subcategories, error } = await supabase
    .from("subcategories")
    .select("*, categories(name)")
    .order("name")

  if (error) {
    console.error("Error fetching subcategories:", error)
    return []
  }

  return subcategories
}

export async function updateProduct(id: string, productData: any) {
  const supabase = createServerSupabaseClient()

  // Update the book record
  const { data: book, error: bookError } = await supabase
    .from("books")
    .update({
      title: productData.title,
      author: productData.author,
      publisher: productData.publisher,
      isbn: productData.isbn,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      page_count: productData.page_count,
      language: productData.language,
      publication_date: productData.publication_date,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (bookError) {
    console.error("Error updating book:", bookError)
    throw new Error("Gagal memperbarui buku")
  }

  // Update categories if provided
  if (productData.categories && productData.categories.length > 0) {
    // First, delete existing category associations
    const { error: deleteError } = await supabase.from("book_categories").delete().eq("book_id", id)

    if (deleteError) {
      console.error("Error deleting book categories:", deleteError)
      throw new Error("Gagal memperbarui kategori buku")
    }

    // Then, insert new category associations
    const categoryInserts = productData.categories.map((categoryId: string) => ({
      book_id: id,
      category_id: categoryId,
    }))

    const { error: insertError } = await supabase.from("book_categories").insert(categoryInserts)

    if (insertError) {
      console.error("Error inserting book categories:", insertError)
      throw new Error("Gagal memperbarui kategori buku")
    }
  }

  // Update subcategories if provided
  if (productData.subcategories && productData.subcategories.length > 0) {
    // First, delete existing subcategory associations
    const { error: deleteError } = await supabase.from("book_subcategories").delete().eq("book_id", id)

    if (deleteError) {
      console.error("Error deleting book subcategories:", deleteError)
      throw new Error("Gagal memperbarui subkategori buku")
    }

    // Then, insert new subcategory associations
    const subcategoryInserts = productData.subcategories.map((subcategoryId: string) => ({
      book_id: id,
      subcategory_id: subcategoryId,
    }))

    const { error: insertError } = await supabase.from("book_subcategories").insert(subcategoryInserts)

    if (insertError) {
      console.error("Error inserting book subcategories:", insertError)
      throw new Error("Gagal memperbarui subkategori buku")
    }
  }

  return book
}

export async function createProduct(productData: any) {
  const supabase = createServerSupabaseClient()

  // Create the book record
  const { data: book, error: bookError } = await supabase
    .from("books")
    .insert({
      title: productData.title,
      author: productData.author,
      publisher: productData.publisher,
      isbn: productData.isbn,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      cover_image: productData.cover_image || null,
      page_count: productData.page_count,
      language: productData.language,
      publication_date: productData.publication_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (bookError) {
    console.error("Error creating book:", bookError)
    throw new Error("Gagal membuat buku baru")
  }

  // Add categories if provided
  if (productData.categories && productData.categories.length > 0) {
    const categoryInserts = productData.categories.map((categoryId: string) => ({
      book_id: book.id,
      category_id: categoryId,
    }))

    const { error: insertError } = await supabase.from("book_categories").insert(categoryInserts)

    if (insertError) {
      console.error("Error inserting book categories:", insertError)
      throw new Error("Gagal menambahkan kategori buku")
    }
  }

  // Add subcategories if provided
  if (productData.subcategories && productData.subcategories.length > 0) {
    const subcategoryInserts = productData.subcategories.map((subcategoryId: string) => ({
      book_id: book.id,
      subcategory_id: subcategoryId,
    }))

    const { error: insertError } = await supabase.from("book_subcategories").insert(subcategoryInserts)

    if (insertError) {
      console.error("Error inserting book subcategories:", insertError)
      throw new Error("Gagal menambahkan subkategori buku")
    }
  }

  return book
}

export async function deleteProduct(id: string) {
  const supabase = createServerSupabaseClient()

  // Delete category associations
  await supabase.from("book_categories").delete().eq("book_id", id)

  // Delete subcategory associations
  await supabase.from("book_subcategories").delete().eq("book_id", id)

  // Delete the book
  const { error } = await supabase.from("books").delete().eq("id", id)

  if (error) {
    console.error("Error deleting book:", error)
    throw new Error("Gagal menghapus buku")
  }

  return true
}

export async function getAllUsers(page = 1, limit = 10, search = "") {
  const supabase = createServerSupabaseClient()

  const offset = (page - 1) * limit

  let query = supabase.from("profiles").select("*", { count: "exact" })

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const {
    data: users,
    count,
    error,
  } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching users:", error)
    return { users: [], count: 0 }
  }

  return { users, count: count || 0 }
}

export async function getUserById(id: string) {
  const supabase = createServerSupabaseClient()

  const { data: user, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  return user
}

export async function updateUserRole(id: string, role: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("profiles").update({ role }).eq("id", id).select().single()

  if (error) {
    console.error("Error updating user role:", error)
    throw new Error("Gagal memperbarui peran pengguna")
  }

  return data
}

export async function updateUserPermissions(id: string, permissions: string[]) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("profiles").update({ permissions }).eq("id", id).select().single()

  if (error) {
    console.error("Error updating user permissions:", error)
    throw new Error("Gagal memperbarui izin pengguna")
  }

  return data
}

export async function getRoles() {
  // In a real application, you might fetch this from a database table
  // For now, we'll return a static list of roles
  return [
    { id: "admin", name: "Administrator", description: "Akses penuh ke semua fitur" },
    {
      id: "editor",
      name: "Editor",
      description: "Dapat mengelola produk tetapi tidak dapat mengelola pengguna atau pengaturan",
    },
    { id: "customer", name: "Pelanggan", description: "Pengguna biasa tanpa akses admin" },
  ]
}

export async function getPermissions() {
  // In a real application, you might fetch this from a database table
  // For now, we'll return a static list of permissions
  return [
    { id: "manage_products", name: "Kelola Produk", description: "Dapat menambah, mengedit, dan menghapus produk" },
    { id: "manage_users", name: "Kelola Pengguna", description: "Dapat melihat dan mengedit pengguna" },
    { id: "manage_orders", name: "Kelola Pesanan", description: "Dapat melihat dan memperbarui status pesanan" },
    { id: "manage_settings", name: "Kelola Pengaturan", description: "Dapat mengubah pengaturan situs" },
    { id: "view_analytics", name: "Lihat Analitik", description: "Dapat melihat data analitik dan laporan" },
  ]
}
