export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          publisher: string | null
          isbn: string | null
          description: string | null
          price: number
          discount_price: number | null
          stock: number
          cover_image: string | null
          page_count: number | null
          language: string | null
          publication_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          publisher?: string | null
          isbn?: string | null
          description?: string | null
          price: number
          discount_price?: number | null
          stock: number
          cover_image?: string | null
          page_count?: number | null
          language?: string | null
          publication_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          publisher?: string | null
          isbn?: string | null
          description?: string | null
          price?: number
          discount_price?: number | null
          stock?: number
          cover_image?: string | null
          page_count?: number | null
          language?: string | null
          publication_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      book_categories: {
        Row: {
          id: string
          book_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          category_id?: string
          created_at?: string
        }
      }
      subcategories: {
        Row: {
          id: string
          name: string
          slug: string
          category_id: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category_id: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category_id?: string
          description?: string | null
          created_at?: string
        }
      }
      book_subcategories: {
        Row: {
          id: string
          book_id: string
          subcategory_id: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          subcategory_id: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          subcategory_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          email: string
          role: string | null
          permissions: string[] | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          email: string
          role?: string | null
          permissions?: string[] | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string
          role?: string | null
          permissions?: string[] | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
  }
}
