# QoreChain Auto Bot

Playwright tabanli QoreChain otomasyon botu. Kayit, terms, wallet olusturma, faucet ve transfer akislarini calistirir; hesap bilgilerini JSON olarak saklar.

## Calisma Modlari

- `npm run dev`: Tek tur, masaustunde gorunur browser ile calisir.
- `npm run loop`: Coklu tur/sonsuz dongu icin runner calistirir.
- `npm run worker`: Render gibi headless ortamlarda loop runner calistirir.

## Yerel Kurulum

1. Bagimliliklari yukle:

```bash
npm install
```

2. Playwright Chromium kur:

```bash
npx playwright install chromium
```

3. `.env.example` dosyasini `.env` olarak kopyalayip doldur.

## Yerelde Test

Tek tur:

```bash
npm run dev
```

Dongu:

```bash
npm run loop
```

Sonsuz dongu icin:

```env
TIMING_MULTI_ACCOUNT_COUNT=0
```

## Kayit Edilen Veriler

`data/wallets.json` icinde su alanlar tutulur:

- `email`
- `password`
- `walletAddress`
- `walletLabel`
- `status`
- `errorMessage`
- `transferredTo`
- `transferCompleted`
- `createdAt`

## Render Deploy

Bu proje Render icin hazirlandi:

- `Dockerfile` headless Playwright worker imaji kurar.
- `render.yaml` bir `worker` servisi tanimlar.
- Veriler `STORAGE_BASE_DIR=/var/data/qorechain-bot` altinda tutulur.
- Persistent disk `/var/data` altina mount edilir.

Render tarafinda temel ayarlar:

- `TRANSFER_WALLET_ADDRESS`
- gerekirse `TIMING_MULTI_ACCOUNT_DELAY`
- gerekirse `TIMING_MULTI_ACCOUNT_COUNT`

Varsayilan Render davranisi:

- headless calisir
- `npm run worker` ile loop baslar
- `TIMING_MULTI_ACCOUNT_COUNT=0` ise sonsuz dongu olur

## Onemli Not

Yerelde gorunur browser ile stabil oldugunu dogrulamadan Render'a gecmeyin. Render tarafinda en buyuk belirsizlik bot kodu degil, hedef sitenin rate limit ve abuse kontrolleridir.
