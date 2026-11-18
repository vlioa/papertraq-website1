# PaperTraq Modular Website (VS Code Architecture)

Website produk teknologi multifungsi **PaperTraq** (3 mode penggunaan: **Badge 0°**, **Reader 180°**, dan **Desk Dock 90°**) yang disusun secara modular untuk dibuka dan dikembangkan langsung di **Visual Studio Code**.

## Struktur Folder

```text
papertraq-website/
├── index.html                  # Homepage utama (Hero 3-Mode + 3.2mm Profile, Features, Build, B2B, Katalog & Cart)
├── journal.html                # Landing Page Editorial Jurnal (Filter topik, Featured Story, Indeks Artikel, 3-Mode Strip)
├── contact.html                # Portal Kontak & B2B Enterprise (Kanal resmi @papertraq & Generator Pesan DM)
├── articles/
│   ├── article-1.html          # Artikel 1: Kartu Nama Digital NFC & Solusi ID Card Karyawan (Mode Badge 0°)
│   ├── article-2.html          # Artikel 2: Teknologi Color E-Paper & E-Reader Saku (Mode Reader 180°)
│   └── article-3.html          # Artikel 3: Display Jam Meja Kerja, Pelacak Tas & Material Sasis (Mode Desk Dock 90°)
├── css/
│   └── style.css               # Design System terpusat (Editorial-Industrial Hairline Grid + Selective Tactile Controls)
├── js/
│   └── app.js                  # Logika interaktif terpusat (Bilingual EN|ID, 3-Mode Switcher, Cart, Copy-to-DM)
└── assets/
    └── pq-mark.svg             # Monogram ikon logo PaperTraq (Favicon & mobile mark)
```

## Cara Menjalankan di VS Code
1. Ekstrak folder `papertraq-website` dan buka melalui **File → Open Folder...** di VS Code.
2. Klik kanan pada `index.html` lalu pilih **Open with Live Server** (atau buka langsung `index.html` di browser).
3. Untuk mengganti tautan akun media sosial atau email cadangan di seluruh halaman, cukup ubah objek `PAPERTRAQ_CONFIG` pada baris paling atas di file `js/app.js`.
