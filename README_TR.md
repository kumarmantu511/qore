# 🤖 QoreChain Auto Bot - Hızlı Başlangıç

## ✅ Güncel Akış

Bot artık şu sırayla çalışıyor:

1. **https://dashboard.qorechain.io/auth/signin** açılır
2. **"Giriş Yap"** butonuna tıklanır
3. **"Sign up"** linkine tıklanır
4. Kayıt formu otomatik doldurulur
5. Hesap oluşturulur
6. Wallet kaydedilir

## 🚀 Kullanım

### Bot'u Çalıştırmak İçin:

```bash
cd c:\Users\vazva\Desktop\qorechain\qorechain-bot
npm run dev
```

### Kontrol Panelini Açmak İçin:

```bash
.\dashboard.bat
```

## 📊 Bot Çıktısı Örneği:

```
============================================================
🤖 Starting QoreChain Bot
============================================================
📧 Email: jackson984@mail.com
🔑 Password: XquGy!8iYpaH
============================================================
🚀 Launching browser...
✓ Browser launched
📍 Navigating to signin page...
✓ Signin page loaded
🔘 Looking for "Giriş Yap" button...
✓ Found "Giriş Yap" button, clicking...
✓ Giriş Yap button clicked
📍 Looking for "Sign up" link...
✓ Found "Sign up" link, clicking...
✓ Signup page loaded successfully
📝 Filling signup form...
✓ Form filled
🔘 Submitting form...
✓ Form submitted
✅ Account created successfully!
✓ Wallet saved for jackson984@mail.com

⏱️ Completed in 25.43s
```

## ⚠️ Bilinen Sorunlar

- Bot bazı durumlarda "Sign up" linkine tıkladıktan sonra sayfa değişmeyebilir
- Bu durumda bot otomatik olarak devam eder
- Wallet address otomatik çıkarılamayabilir (manuel kopyalama gerekebilir)

## 🛠️ Sorun Giderme

### Bot Takılırsa:
1. `screenshots/` klasöründeki hatalara bakın
2. Console çıktısını kontrol edin
3. Internet bağlantınızı test edin

### JSON Hatası:
```bash
# wallets.json dosyasını düzeltin
echo [] > data/wallets.json
```

## 📁 Dosya Yolları

- **Bot:** `src/bot.ts`
- **Wallets:** `data/wallets.json`
- **Screenshots:** `screenshots/`
- **Dashboard:** `dashboard/control-panel.html`

## 🎯 Sonraki Adımlar

1. Bot'u çalıştırın
2. Oluşturulan hesabı kontrol edin
3. Dashboard'dan wallet address'i manuel kopyalayın
4. `.env` dosyasına `TRANSFER_WALLET_ADDRESS` ekleyin

---

**Hazır!** Bot çalışıyor ve hesaplar oluşturuluyor! 🚀
