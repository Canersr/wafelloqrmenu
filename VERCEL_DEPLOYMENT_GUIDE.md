
# Vercel'de Projeyi Yayınlama Rehberi

Merhaba! Bu rehber, projenizi Vercel'de başarıyla yayınlarken karşılaştığınız `auth/invalid-api-key` hatasını çözmek için hazırlanmıştır. 

**Önemli Not:** Sorun kodda değil, Vercel'in projenizin gizli anahtarlarını (API Key vb.) bilmemesinden kaynaklanıyor. Güvenlik nedeniyle bu anahtarlar doğrudan koda yazılamaz. Bu bilgileri, aşağıda anlatıldığı gibi Vercel'in güvenli "Environment Variables" (Ortam Değişkenleri) paneline sizin eklemeniz gerekmektedir.

Lütfen aşağıdaki adımları dikkatlice takip edin.

---

### Adım 1: Firebase Proje Ayarlarını Açın

1.  [Firebase Konsolu'na](https://console.firebase.google.com/) gidin.
2.  `Wafello` projenizi seçin.
3.  Sol üst köşedeki **çark simgesine (⚙️)** tıklayın ve **Project settings (Proje Ayarları)** seçeneğini seçin.

---

### Adım 2: Firebase Gizli Anahtarlarını Bulun ve Kopyalayın

1.  **General (Genel)** sekmesinde, sayfanın altına doğru kaydırın.
2.  **Your apps (Uygulamalarınız)** bölümünde, web uygulamanızı (`wafelloqr.com` veya benzeri) göreceksiniz.
3.  **SDK setup and configuration (SDK kurulumu ve yapılandırması)** bölümünde, **Config (Yapılandırma)** seçeneğini seçin.
4.  Aşağıdaki resimde gösterilen `firebaseConfig` objesinin içindeki anahtarları ve değerlerini kopyalamanız gerekecek.

---

### Adım 3: Cloudinary Bilgilerini Bulun

1.  [Cloudinary Paneli'ne](https://cloudinary.com/console) gidin.
2.  Panonuzda (Dashboard), `Cloud Name` gibi bilgileri göreceksiniz.
3.  **Settings (Ayarlar) > Upload (Yükleme)** sekmesine gidin.
4.  Sayfanın altında **Upload presets (Yükleme ön ayarları)** bölümünü bulun ve Wafello için oluşturduğunuz preset'in adını not alın.

---

### Adım 4: Vercel'e Ortam Değişkenlerini Girin

Bu en önemli adımdır.

1.  [Vercel Paneli'ne](https://vercel.com/dashboard) gidin ve `wafello` projenizi seçin.
2.  **Settings (Ayarlar)** sekmesine tıklayın.
3.  Soldaki menüden **Environment Variables (Ortam Değişkenleri)** seçeneğini seçin.
4.  Aşağıdaki **TÜM** anahtarları ve Firebase/Cloudinary'den kopyaladığınız karşılık gelen değerleri **tek tek** ekleyin. **Herhangi birini atlamadığınızdan emin olun.**

**Firebase Değişkenleri:**

| Anahtar (KEY)                               | Değer (VALUE)                                  |
| ------------------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`              | *Firebase'den kopyaladığınız apiKey*           |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`          | *Firebase'den kopyaladığınız authDomain*       |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`           | *Firebase'den kopyaladığınız projectId*        |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`       | *Firebase'den kopyaladığınız storageBucket*    |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`  | *Firebase'den kopyaladığınız messagingSenderId* |
| `NEXT_PUBLIC_FIREBASE_APP_ID`               | *Firebase'den kopyaladığınız appId*            |

**Cloudinary Değişkenleri (Resim Yükleme İçin Gerekli):**

| Anahtar (KEY)                             | Değer (VALUE)                                       |
| ----------------------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`       | *Cloudinary panonuzdaki Cloud Name*                 |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`    | *Cloudinary'deki Upload Preset adınız*              |

---

### Adım 5: Projeyi Yeniden Dağıtın (Redeploy)

1.  Tüm ortam değişkenlerini kaydettikten sonra, Vercel projenizin **Deployments (Dağıtımlar)** sekmesine gidin.
2.  En son, başarısız olan dağıtımın yanındaki **üç nokta (...)** menüsüne tıklayın.
3.  **Redeploy** seçeneğini seçin.

Bu işlem, Vercel'in projenizi yeni eklediğiniz ortam değişkenleriyle birlikte sıfırdan derlemesini sağlayacaktır. Bu sefer build işleminin başarıyla tamamlanması gerekiyor.

Başarılar!
