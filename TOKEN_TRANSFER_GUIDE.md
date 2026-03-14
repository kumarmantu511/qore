# 💰 Token Transfer Özelliği Rehberi

## 🎯 Nedir Bu Token Transfer?

Bot, oluşturduğu hesaplardan kazandığı token'ları otomatik olarak sizin cüzdanınıza gönderebilir.

---

## ⚙️ Nasıl Yapılandırılır?

### 1. .env Dosyasını Düzenleyin

`.env` dosyasını açın ve wallet address'inizi ekleyin:

```env
# Token Transfer (Wallet Address to send tokens)
# Add your wallet address here to receive tokens from created accounts
TRANSFER_WALLET_ADDRESS=0xYourWalletAddressHere
```

### 2. Örnek Yapılandırma

```env
# ... diğer ayarlar ...

# Token Transfer
TRANSFER_WALLET_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

---

## 📊 Wallet Entry Yapısı

Bot artık her wallet entry'ye transfer bilgilerini kaydediyor:

```typescript
interface WalletEntry {
  id: string;
  email: string;
  password: string;
  walletAddress: string;          // Oluşturulan hesap wallet
  createdAt: string;
  status: 'active' | 'error' | 'pending';
  errorMessage?: string;
  transferredTo?: string;         // Token gönderilen adres
  transferTxHash?: string;        // İşlem hash'i
}
```

---

## 🔧 Kullanım Senaryoları

### Senaryo 1: Tek Bir Wallet'a Topla

Tüm hesaplardan token'ları tek cüzdana gönder:

```env
TRANSFER_WALLET_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### Senaryo 2: Farklı Cüzdanlar

Her hesap için farklı cüzdan kullanmak isterseniz:
- Bot çalıştırdıktan sonra `data/wallets.json` dosyasını manuel düzenleyin
- Her wallet entry için `transferredTo` alanını doldurun

### Senaryo 3: Transfer Kapalı

Token transferi yapmak istemiyorsanız:

```env
TRANSFER_WALLET_ADDRESS=
# veya
# TRANSFER_WALLET_ADDRESS değeri boş bırakılmış
```

---

## 📝 JSON Output Örneği

Bot çalıştırdıktan sonra `data/wallets.json`:

```json
[
  {
    "id": "abc123",
    "email": "emma247@gmail.com",
    "password": "Kx8#mNp2Qr5T",
    "walletAddress": "0x8f3Cf7c29B8D4E1A6e9F0b5D2c1A7E4B9d6C3a8F",
    "createdAt": "2026-03-13T10:30:45.123Z",
    "status": "active",
    "transferredTo": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "transferTxHash": "0xabc123def456..."
  },
  {
    "id": "def456",
    "email": "liam892@yahoo.com",
    "password": "Zy7$pLm3Nx9W",
    "walletAddress": "0x2a5Bc8d9E1f3A7b6C4d2E8f9A0b1C3d5E7f8A9b0",
    "createdAt": "2026-03-13T10:31:12.456Z",
    "status": "active",
    "transferredTo": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "transferTxHash": "0xdef456abc789..."
  }
]
```

---

## 🚀 Gelecek Özellikler (TODO)

Bot şu anda transfer bilgilerini kaydediyor ama otomatik transfer yapmıyor.

### Planlanan Özellikler:

1. **Otomatik Token Transfer**
   - Bot account creation sonrası otomatik transfer yapacak
   - Smart contract ile token'ları gönderecek

2. **Batch Transfer**
   - Tüm hesaplardan tek işlemde topla
   - Gas fee optimizasyonu

3. **Transfer Zamanlaması**
   - Belirli bir bakiyeye ulaşınca transfer et
   - Zamanlanmış transferler

4. **Multi-Token Desteği**
   - Birden fazla token türü transfer et
   - Token swap entegrasyonu

---

## 🔒 Güvenlik Notları

### ⚠️ ÖNEMLİ UYARI:

1. **Private Key'leri Asla Paylaşmayın!**
   - Bot private key'leri saklamaz
   - Private key'ler .env'de OLMAMALI

2. **Wallet Address Güvenliği**
   - Sadece PUBLIC wallet address ekleyin
   - Private key veya mnemonic EKLEMEYİN

3. **Gas Fee**
   - Token transfer için gas fee gerekir
   - Hesaplarda yeterli bakiye olmalı

---

## 📊 Dashboard Görünümü

Dashboard'da transfer bilgileri gösterilecek:

| Email | Wallet Address | Status | Transferred To | TX Hash |
|-------|---------------|--------|----------------|---------|
| emma@... | 0x8f3... | ✅ Active | 0x742... | 0xabc... |
| liam@... | 0x2a5... | ✅ Active | 0x742... | 0xdef... |

---

## 🛠️ Manuel Transfer (Şimdilik)

Bot otomatik transfer yapana kadar:

### Adım 1: Wallet'ları Kontrol Et
```bash
cat data/wallets.json
```

### Adım 2: Her Wallet'tan Transfer Et
Manuel olarak her hesaptan token'ları gönderin.

### Adım 3: Transfer Bilgilerini Güncelle
```bash
node -e "
const fs = require('fs');
const wallets = JSON.parse(fs.readFileSync('data/wallets.json'));
wallets[0].transferredTo = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
wallets[0].transferTxHash = '0xabc123...';
fs.writeFileSync('data/wallets.json', JSON.stringify(wallets, null, 2));
"
```

---

## 📚 İlgili Dosyalar

- `.env` - Transfer wallet address yapılandırması
- `src/config.ts` - Transfer ayarları
- `src/storage.ts` - Wallet entry interface
- `src/bot.ts` - Bot logic (transfer hazır)
- `data/wallets.json` - Transfer kayıtları

---

## 🎉 Özet

✅ **Yapıldı:**
- .env'e TRANSFER_WALLET_ADDRESS eklendi
- WalletEntry'ye transfer alanları eklendi
- Config sistemi hazırlandı

⏳ **Yapılacak:**
- Otomatik token transfer implementasyonu
- Smart contract entegrasyonu
- Gas fee yönetimi
- Batch transfer desteği

---

**Hazır!** Şimdi sadece `.env` dosyasına wallet address'inizi ekleyin! 🚀

```env
TRANSFER_WALLET_ADDRESS=0xYourWalletAddressHere
```
