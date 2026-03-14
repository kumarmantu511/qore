# 🚀 QoreChain Auto Bot - Hızlı Başlangıç

## ✅ Yapılan Değişiklikler

### Yeni Özellikler:
1. **Dashboard Akışı** - Bot artık önce `https://dashboard.qorechain.io/` adresine gidiyor
2. **Otomatik Giriş** - "Giriş Yap" butonuna otomatik tıklıyor
3. **Sign Up Linki** - Login sayfasından "Sign up" linkine tıklıyor
4. **Random İsimler** - Artık `qoreuser` yerine rastgele insan isimleri kullanılıyor
   - Örnek: `emma247@gmail.com`, `liam892@yahoo.com`, `olivia531@outlook.com`
5. **Güvenilir URL'ler** - Güncel signup URL'leri kullanılıyor

### Dashboard.bat Düzeltildi:
- Artık kapanmıyor, açık kalıyor
- Daha bilgilendirici mesajlar
- Otomatik http-server kurulumu

---

## 📋 Kurulum (İlk Kullanım)

```bash
cd c:\Users\vazva\Desktop\qorechain\qorechain-bot
npm install
npx playwright install chromium
```

---

## 🎯 Kullanım

### Yöntem 1: Batch Dosyası (En Kolay)
```
start.bat dosyasına çift tıkla
```

### Yöntem 2: NPM Script
```bash
npm run dev
```

### Dashboard Açmak İçin:
```
dashboard.bat dosyasına çift tıkla
```
veya
```bash
npm run dashboard
```

---

## 🔄 Bot Akışı

1. **Dashboard'a Git** → `https://dashboard.qorechain.io/`
2. **"Giriş Yap" Tıkla** → Siyah butona tıklar
3. **"Sign up" Tıkla** → Login sayfasında kayıt linkine tıklar
4. **Form Doldur** → Email ve şifre girer
5. **Submit** → Kayıt butonuna tıklar
6. **Şartları Kabul Et** → Terms of Service kabul eder
7. **Cüzdan Adresi Al** → Dashboard'dan wallet address'i alır
8. **Kaydet** → `data/wallets.json` dosyasına kaydeder

---

## 📊 Oluşturulan Hesap Örneği

**Email:** `emma247@gmail.com`  
**Şifre:** `Kx8#mNp2Qr5T`  
**Wallet:** `0x8f3Cf7c29B8D4E1A6e9F0b5D2c1A7E4B9d6C3a8F`

Artık `qoreuser` yerine rastgele isimler:
- alex123@gmail.com
- emma567@yahoo.com
- liam890@outlook.com
- olivia234@gmail.com

---

## ⚙️ Özelleştirme

### Email Formatını Değiştirmek İçin:
`src/email-generator.ts` dosyasını düzenle:

```typescript
const FIRST_NAMES = [
  'alex', 'john', 'emma',  // İstediğin isimleri ekle
];
```

### Hız Ayarları:
`src/config.ts` dosyasını düzenle:

```typescript
browser: {
  slowMo: 50,     // Daha hızlı için azalt (50-200 arası)
}
```

### Görünmez Mod:
```typescript
browser: {
  headless: true,  // Tarayıcı görünmesin
}
```

---

## 🐛 Sorun Giderme

### Dashboard.bat Kapanıyor
**Çözüm:** `pause` komutu eklendi, artık açık kalmalı

### Bot Hata Veriyor
1. `screenshots/` klasöründeki hatalara bak
2. Console çıktısını kontrol et
3. Internet bağlantısını kontrol et

### Wallet Adresi Bulunamadı
- Sayfa yapısı değişmiş olabilir
- Manuel olarak dashboard'dan kontrol et
- Hesap yine de oluşturulmuş olabilir

---

## 📁 Dosya Yapısı

```
qorechain-bot/
├── start.bat              # Windows başlatıcı
├── dashboard.bat          # Dashboard başlatıcı
├── src/
│   ├── bot.ts            # Ana bot (GÜNCELLENDİ)
│   ├── email-generator.ts # Random email (GÜNCELLENDİ)
│   ├── password-generator.ts
│   ├── storage.ts
│   └── config.ts         # Ayarlar (GÜNCELLENDİ)
├── data/
│   └── wallets.json      # Cüzdan verileri
└── dashboard/
    └── index.html        # Web arayüzü
```

---

## 🎉 Test Etmek İçin:

1. **Tek Hesap:**
   ```bash
   npm run dev
   ```

2. **Çoklu Hesap:**
   ```bash
   # src/multi-account-runner.ts içinde count'u ayarla
   npm run multi
   ```

3. **Sonuçları Görüntüle:**
   ```bash
   npm run dashboard
   ```

---

## ⚠️ Önemli Notlar

- ✅ **Yeni URL'ler** artık kullanılıyor
- ✅ **Random isimler** kullanılıyor (qoreuser değil)
- ✅ **Dashboard akışı** eklendi
- ✅ **Login button** otomatik tıklanıyor
- ⚠️ **İnternet bağlantısı** gerekli
- ⚠️ **Node.js 18+** gerekli

---

## 🆘 Yardım

Sorun yaşarsanız:
1. Console çıktısını kontrol edin
2. `screenshots/` klasörüne bakın
3. `data/wallets.json` dosyasını kontrol edin
4. Internet bağlantınızı test edin

Başarılar! 🚀
