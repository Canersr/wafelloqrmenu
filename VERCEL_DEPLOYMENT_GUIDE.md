# Vercel'de Projeyi Yayınlama Rehberi

Merhaba! Bu rehber, projenizi Vercel'de başarıyla yayınlamanıza yardımcı olmak için hazırlanmıştır. Projeniz artık veritabanı veya harici servisler kullanmadığı için yapılandırma oldukça basittir.

**Önemli Not:** Artık Firebase veya Cloudinary için herhangi bir Ortam Değişkeni (Environment Variables) girmenize **GEREK YOKTUR**. Proje tamamen statik hale getirilmiştir.

Eğer daha önceki denemelerinizden kalma ortam değişkenleri varsa, bunları Vercel projenizin ayarlarından silebilirsiniz. Bu, olası kafa karışıklıklarını önleyecektir.

---

### Projeyi Vercel'e Nasıl Yüklerim?

1.  **GitHub'a Yükleyin:** Projenizin kodlarını bir GitHub deposuna (repository) yükleyin.
2.  **Vercel'e Giriş Yapın:** [Vercel Paneli'ne](https://vercel.com/dashboard) gidin ve GitHub hesabınızla giriş yapın.
3.  **Yeni Proje Ekleyin:** "Add New... > Project" butonuna tıklayın.
4.  **GitHub Deponuzu Seçin:** Projenizi yüklediğiniz GitHub deposunu bulun ve "Import" butonuna tıklayın.
5.  **Yapılandırma:** Vercel, projenizin bir Next.js projesi olduğunu otomatik olarak algılayacaktır. Herhangi bir ayarı değiştirmenize gerek yok. "Framework Preset" olarak "Next.js" seçili olmalıdır.
6.  **Dağıtın (Deploy):** "Deploy" butonuna tıklayın.

Vercel, projenizi otomatik olarak derleyecek ve size bir URL verecektir. İşlem bu kadar basit!

---

### Menüyü Nasıl Güncellerim?

Tüm menü yönetimi artık doğrudan kod içerisinden yapılmaktadır.

1.  **VS Code'u Açın:** Projenizi VS Code veya tercih ettiğiniz bir kod düzenleyicide açın.
2.  **Menü Veri Dosyasını Bulun:** `src/lib/menu-data.ts` dosyasını açın.
3.  **Değişiklikleri Yapın:** Bu dosyanın içindeki `allMenuItems` dizisini düzenleyerek ürün ekleyebilir, silebilir veya mevcut ürünleri güncelleyebilirsiniz. Dosyanın en üstündeki talimatlar size yol gösterecektir.
4.  **Resimleri Ekleyin:** Ürün resimlerinizi `public/images/menu/` klasörüne ekleyin.
5.  **Değişiklikleri GitHub'a Gönderin:** Yaptığınız değişiklikleri kaydedip GitHub deponuza gönderin (`git add .`, `git commit -m "menü güncellendi"`, `git push`).

Vercel, GitHub deponuzdaki bu yeni değişiklikleri otomatik olarak algılayacak ve sitenizi saniyeler içinde güncelleyecektir.

Başarılar!
