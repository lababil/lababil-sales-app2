# 🚀 Panduan Deploy Aplikasi Lababil Solution

## Langkah-Langkah Deploy ke Web

### 1. 📁 Struktur Folder Project
Buat folder dengan struktur seperti ini:
```
lababil-sales-app/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.js
│       └── page.js
├── package.json
├── next.config.js
├── tailwind.config.js
├── vercel.json
└── README.md
```

### 2. 🔧 Setup Project Lokal

#### Install Node.js
1. Download Node.js dari [nodejs.org](https://nodejs.org) (pilih LTS version)
2. Install Node.js di komputer Anda
3. Buka Command Prompt/Terminal dan cek:
   ```bash
   node --version
   npm --version
   ```

#### Buat Project Baru
1. Buat folder baru: `lababil-sales-app`
2. Copy semua file yang sudah diberikan ke folder tersebut
3. Buka Command Prompt di folder project
4. Jalankan:
   ```bash
   npm install
   ```

#### Test Lokal
```bash
npm run dev
```
Buka browser ke `http://localhost:3000`

### 3. 📂 Upload ke GitHub

#### Setup GitHub
1. Buat akun di [github.com](https://github.com) (jika belum punya)
2. Install Git di komputer: [git-scm.com](https://git-scm.com)
3. Buat repository baru dengan nama `lababil-sales-app`

#### Upload Code
Di Command Prompt/Terminal:
```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Lababil Sales App"

# Connect to GitHub (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/lababil-sales-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. 🌐 Deploy ke Vercel

#### Via Website Vercel
1. Buka [vercel.com](https://vercel.com)
2. Sign up dengan akun GitHub Anda
3. Klik "New Project"
4. Import repository `lababil-sales-app` dari GitHub
5. Klik "Deploy"
6. Tunggu proses deploy selesai (2-3 menit)
7. Aplikasi akan live di URL seperti: `https://lababil-sales-app-username.vercel.app`

#### Via Vercel CLI (Opsional)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

### 5. 🔒 Environment Variables (untuk Firebase)

Saat setup Firebase nanti, tambahkan environment variables di Vercel:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Tambahkan:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - dll.

### 6. 🔥 Setup Firebase (Opsional untuk data persistent)

#### Buat Project Firebase
1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. Klik "Add project"
3. Nama project: "lababil-sales"
4. Enable Firestore Database

#### Config Firebase
Buat file `src/lib/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 7. 🎯 Custom Domain (Opsional)

1. Beli domain di provider seperti Niagahoster, Dewaweb, dll
2. Di Vercel Dashboard → Project → Settings → Domains
3. Add domain dan ikuti instruksi DNS

### 8. 🔄 Auto Deploy

Setiap kali Anda push code baru ke GitHub:
```bash
git add .
git commit -m "Update features"
git push
```
Vercel akan otomatis deploy ulang!

## 🚀 URL Aplikasi Anda

Setelah deploy berhasil, aplikasi akan dapat diakses di:
- Vercel URL: `https://lababil-sales-app.vercel.app`
- Custom Domain: `https://yourdomain.com` (jika setup domain)

## 📱 Features yang Tersedia

✅ Dashboard penjualan dengan statistik real-time  
✅ Manajemen produk (CRUD operations)  
✅ Recording penjualan dengan customer info  
✅ Search & filter untuk produk dan penjualan  
✅ **Print receipt individual untuk setiap transaksi** 🖨️  
✅ **Print laporan penjualan lengkap** 📊  
✅ **Download receipt dan laporan sebagai HTML** 💾  
✅ Preview modal sebelum print  
✅ Responsive design untuk desktop dan mobile  
✅ Format mata uang IDR  
✅ Firebase integration untuk data persistent  
✅ Real-time sync antar device  
✅ Error handling dan loading states  

## 🛠 Troubleshooting

### Error saat npm install
```bash
npm cache clean --force
npm install
```

### Error saat deploy Vercel
**Error: "functions property cannot be used with builds property"**
- Hapus file `vercel.json` atau gunakan versi sederhana
- Vercel otomatis mendeteksi Next.js tanpa konfigurasi tambahan
- Pastikan `package.json` ada dan benar

**Error: Build failed**
- Check build logs di Vercel Dashboard
- Pastikan semua dependencies ter-install
- Coba build lokal: `npm run build`

### App tidak jalan
- Check browser console untuk error
- Pastikan semua dependencies ter-install

## 📞 Support

Jika ada kendala, bisa contact developer atau check:
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
