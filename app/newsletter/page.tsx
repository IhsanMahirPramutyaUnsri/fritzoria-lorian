"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function NewsletterPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate subscription
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
    }, 1500)
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Berlangganan Newsletter</CardTitle>
            <CardDescription>
              Dapatkan informasi terbaru dan penawaran eksklusif langsung ke kotak masuk Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubscribed ? (
              <div className="text-center py-6">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Berhasil Berlangganan!</h3>
                <p className="text-muted-foreground">
                  Terima kasih telah berlangganan newsletter kami. Kami akan mengirimkan informasi terbaru ke email
                  Anda.
                </p>
                <Button
                  className="mt-6"
                  onClick={() => {
                    setIsSubscribed(false)
                    setEmail("")
                    setName("")
                  }}
                >
                  Berlangganan dengan Email Lain
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    placeholder="Nama Lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@contoh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Mendaftar..." : "Berlangganan Sekarang"}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Dengan berlangganan, Anda menyetujui{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Kebijakan Privasi
                  </a>{" "}
                  kami.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
