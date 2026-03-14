# 🔧 Environment Variables (.env) Kullanım Rehberi

## 📋 Nedir Bu .env Dosyası?

`.env` dosyası, bot'un tüm ayarlarını kod değişikliği yapmadan değiştirebilmenizi sağlayan bir yapılandırma dosyasıdır.

---

## 🚀 Hızlı Başlangıç

### 1. .env Dosyasını Düzenleyin
```bash
# .env dosyasını açın ve istediğiniz ayarları değiştirin
```

### 2. Bot'u Çalıştırın
```bash
npm run dev
```

Bot otomatik olarak `.env` dosyasından ayarları okuyacaktır!

---

## ⚙️ Mevcut Ayarlar

### Browser Settings

```env
# Tarayıcı görünür olsun mu? (false = görünür, true = gizli)
BROWSER_HEADLESS=false

# İşlemler arası bekleme süresi (ms) - yüksek = yavaş ama güvenilir
BROWSER_SLOW_MO=100

# Tarayıcı penceresi boyutu [genişlik, yükseklik]
BROWSER_VIEWPORT_WIDTH=1920
BROWSER_VIEWPORT_HEIGHT=1080
```

### Account Creation

```env
# Email üretme prefix'i
ACCOUNT_EMAIL_PREFIX=qoreuser

# Şifre uzunluğu (min 8 karakter)
ACCOUNT_PASSWORD_LENGTH=12

# Kullanılacak email domainleri (virgülle ayrılmış)
EMAIL_DOMAINS=gmail.com,yahoo.com,outlook.com,protonmail.com,icloud.com,mail.com
```

### Timing & Retry

```env
# Sayfa yükleme zaman aşımı (ms)
TIMING_PAGE_TIMEOUT=60000

# Maksimum tekrar deneme sayısı
TIMING_MAX_RETRIES=3

# Çoklu hesap oluşturma arası bekleme (ms)
TIMING_MULTI_ACCOUNT_DELAY=5000

# Oluşturulacak hesap sayısı (multi-account modunda)
TIMING_MULTI_ACCOUNT_COUNT=3
```

### Dashboard

```env
# Dashboard otomatik yenileme aralığı (ms)
DASHBOARD_REFRESH_INTERVAL=30000

# Dashboard web sunucu portu
DASHBOARD_PORT=3000
```

### URLs

```env
# QoreChain dashboard URL
URL_DASHBOARD=https://dashboard.qorechain.io/

# Login sayfası URL
URL_LOGIN=https://auth.qorechain.io/login?response_type=code&client_id=...

# Signup sayfası URL
URL_SIGNUP=https://auth.qorechain.io/signup?response_type=code&client_id=...
```

### Storage

```env
# Wallet verilerinin kaydedileceği dosya
STORAGE_WALLETS_FILE=data/wallets.json

# Screenshot klasörü
STORAGE_SCREENSHOTS_DIR=screenshots
```

---

## 💡 Pratik Örnekler

### Örnek 1: Hızlı Test (Görünmez Mod)
```env
BROWSER_HEADLESS=true
BROWSER_SLOW_MO=50
TIMING_PAGE_TIMEOUT=45000
```

### Örnek 2: Yavaş ve Güvenilir (İzlemek İçin)
```env
BROWSER_HEADLESS=false
BROWSER_SLOW_MO=200
TIMING_MAX_RETRIES=5
TIMING_PAGE_TIMEOUT=90000
```

### Örnek 3: Çoklu Hesap (10 Adet)
```env
TIMING_MULTI_ACCOUNT_COUNT=10
TIMING_MULTI_ACCOUNT_DELAY=8000
```

### Örnek 4: Özel Email Pattern
```env
ACCOUNT_EMAIL_PREFIX=testuser
EMAIL_DOMAINS=protonmail.com,tutanota.com
```

### Örnek 5: Farklı Port ve Klasör
```env
DASHBOARD_PORT=8080
STORAGE_WALLETS_FILE=mydata/wallets.json
STORAGE_SCREENSHOTS_DIR=my_errors
```

---

## 🔍 Değişkenlerin Açıklamaları

### BROWSER_HEADLESS
- **Değerler:** `true` veya `false`
- **Varsayılan:** `false`
- **Açıklama:** 
  - `false` = Tarayıcı penceresi görünür (debug için iyi)
  - `true` = Tarayıcı arka planda çalışır (üretim için iyi)

### BROWSER_SLOW_MO
- **Değerler:** 0-1000+ (ms)
- **Varsayılan:** `100`
- **Açıklama:** Her işlem arası bekleme süresi
  - `0-50` = Çok hızlı (hata riski yüksek)
  - `50-150` = Normal hız
  - `150-300` = Yavaş ve güvenilir
  - `300+` = Çok yavaş (sorun giderme için)

### TIMING_MAX_RETRIES
- **Değerler:** 1-10
- **Varsayılan:** `3`
- **Açıklama:** Bir hata olduğunda kaç kez denenecek

### EMAIL_DOMAINS
- **Format:** Virgülle ayrılmış domain listesi
- **Örnek:** `gmail.com,yahoo.com,outlook.com`
- **Not:** Random email oluştururken bu listeden seçilir

---

## 🎯 Hangi Ayarı Ne Zaman Değiştirmeli?

### Bot Hata Veriyorsa:
```env
BROWSER_SLOW_MO=200        # Daha yavaş
TIMING_PAGE_TIMEOUT=90000  # Daha uzun timeout
TIMING_MAX_RETRIES=5       # Daha fazla deneme
```

### Bot Çok Yavaşsa:
```env
BROWSER_SLOW_MO=50         # Daha hızlı
BROWSER_HEADLESS=true      # Görünmez mod
```

### Daha Fazla Hesap İçin:
```env
TIMING_MULTI_ACCOUNT_COUNT=20
TIMING_MULTI_ACCOUNT_DELAY=3000  # Daha kısa bekleme
```

### Farklı Email Formatı İçin:
```env
ACCOUNT_EMAIL_PREFIX=customuser
EMAIL_DOMAINS=ozeldomain.com
```

---

## 📊 Öncelik Sırası

Bot ayarları şu sırayla yüklenir:

1. **.env dosyası** → En yüksek öncelik
2. **config.ts varsayılanları** → Düşük öncelik

Yani `.env`'de bir değer varsa o kullanılır, yoksa config.ts'deki varsayılan değer kullanılır.

---

## 🔒 Güvenlik Notları

### ⚠️ .env Dosyasını Paylaşmayın!
```bash
# .env dosyanızı asla git'e commit etmeyin
# Bunun yerine .env.example'ı paylaşın
```

### ✅ İyi Pratik:
```bash
.env              # Git'e EKLEME (.gitignore'da olmalı)
.env.example      # Git'e EKLE (örnek değerlerle)
```

### Hassas Bilgiler:
- API anahtarları
- Database bağlantıları
- Özel URL'ler
- Şifreler

---

## 🛠️ Sorun Giderme

### .env Okumuyor
**Çözüm:**
```bash
# Bot'u yeniden başlatın
npm run dev

# .env dosyasının doğru konumda olduğundan emin olun
# qorechain-bot/.env
```

### Değişiklikler Uygulanmıyor
**Çözüm:**
```bash
# Bot'u tamamen durdurun (Ctrl+C)
# Yeniden başlatın
npm run dev
```

### Dashboard Port Değişmedi
**Çözüm:**
```env
# .env dosyasını kontrol edin
DASHBOARD_PORT=3000

# Port kullanımda mı kontrol edin
netstat -ano | findstr :3000
```

---

## 📝 .env.example Kullanımı

### Yeni Proje Başlatırken:

1. **.env.example'ı kopyalayın:**
   ```bash
   copy .env.example .env
   ```

2. **.env'i düzenleyin:**
   ```bash
   notepad .env
   ```

3. **Kendi değerlerinizi girin**

4. **Bot'u başlatın:**
   ```bash
   npm run dev
   ```

---

## 🎉 Örnek .env Yapılandırmaları

### Yapılandırma 1: Geliştirme (Development)
```env
BROWSER_HEADLESS=false
BROWSER_SLOW_MO=150
TIMING_MAX_RETRIES=5
DASHBOARD_PORT=3000
```

### Yapılandırma 2: Üretim (Production)
```env
BROWSER_HEADLESS=true
BROWSER_SLOW_MO=50
TIMING_MAX_RETRIES=3
DASHBOARD_PORT=80
```

### Yapılandırma 3: Hata Ayıklama (Debugging)
```env
BROWSER_HEADLESS=false
BROWSER_SLOW_MO=500
TIMING_PAGE_TIMEOUT=120000
TIMING_MAX_RETRIES=10
```

---

## 📚 Daha Fazla Bilgi

- **Resmi Dokümantasyon:** README.md
- **Hızlı Başlangıç:** QUICKSTART.md
- **Türkçe Rehber:** HIZLI_BASLANGIC.md
- **Kullanım Örnekleri:** USAGE_EXAMPLES.md

---

**Başarılar!** Artık tüm ayarlarınızı `.env` dosyasından yönetebilirsiniz! 🚀
