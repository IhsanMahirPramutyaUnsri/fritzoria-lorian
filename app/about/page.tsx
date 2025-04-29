import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Tentang Fritzoria</h1>

      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Visi Kami</CardTitle>
            <CardDescription>Menjadi platform digital terdepan di Indonesia</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fritzoria didirikan dengan visi untuk menjadi platform digital terdepan di Indonesia yang menghubungkan
              pengguna dengan berbagai layanan dan konten berkualitas. Kami berkomitmen untuk terus berinovasi dan
              memberikan pengalaman terbaik bagi pengguna kami.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Misi Kami</CardTitle>
            <CardDescription>Memberikan layanan terbaik untuk semua pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Misi kami adalah menyediakan platform yang mudah digunakan, aman, dan terpercaya bagi semua pengguna. Kami
              berusaha untuk:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
              <li>Mengembangkan teknologi inovatif yang memudahkan kehidupan sehari-hari</li>
              <li>Membangun komunitas yang inklusif dan mendukung</li>
              <li>Memberikan layanan pelanggan yang responsif dan membantu</li>
              <li>Berkontribusi positif pada masyarakat dan lingkungan</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nilai-Nilai Kami</CardTitle>
            <CardDescription>Prinsip yang memandu kami setiap hari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Inovasi</h3>
                <p className="text-sm text-muted-foreground">
                  Kami selalu mencari cara baru untuk meningkatkan layanan kami.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Integritas</h3>
                <p className="text-sm text-muted-foreground">
                  Kami beroperasi dengan kejujuran dan transparansi dalam semua yang kami lakukan.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Inklusivitas</h3>
                <p className="text-sm text-muted-foreground">
                  Kami menghargai keberagaman dan menciptakan lingkungan yang ramah untuk semua.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Dampak</h3>
                <p className="text-sm text-muted-foreground">
                  Kami berusaha membuat perbedaan positif dalam kehidupan pengguna kami.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
