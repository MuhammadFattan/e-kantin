# Kantin Raden Fatah — Demo Sistem Informasi Penjualan UMKM

Prototype food-ordering untuk UMKM kantin UIN Raden Fatah Palembang. Aplikasi menggunakan Next.js App Router, React, JavaScript dan Tailwind CSS. Katalog, akun, pengajuan pemilik, keranjang dan pesanan disimpan secara lokal di browser; belum memerlukan backend atau database.

## Menjalankan

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan Next.js (default `http://localhost:3000`). Untuk platform Manus Preview, gunakan link Preview yang disediakan untuk proyek.

## Akun dan peran

- Masuk melalui `/login` menggunakan username dan kata sandi.
- Akun contoh memakai kata sandi `demo123`: `mahasiswa`, `admin`, `sitikantin`, `ahmadkantin`, `kantinekonomi`, `kantinsyariah`, dan `kantinperpus`.
- Mahasiswa/staf dapat mendaftar sendiri melalui `/signup`; akun admin tidak dapat dibuat dari halaman pendaftaran.
- Pemilik kantin mengajukan data diri, nomor KTP, produk, kapasitas kursi, dan lokasi melalui `/signup`. Akun aktif setelah admin menyetujui pengajuan melalui **Admin → Verifikasi**.
- Pemilik mengatur penerimaan makan di tempat dan kapasitas kursi pada profil kantin. Kursi pesanan aktif mengurangi ketersediaan hingga pesanan selesai atau dibatalkan.
- Pembeli dapat memilih makan di tempat atau pengantaran. Pemilik memperbarui status order hingga pesanan selesai/diantar.

Tombol **Reset data demo** mengembalikan data contoh.

## Batasan demo

Login dan penyimpanan ini hanya simulasi client-side, bukan autentikasi produksi. Kata sandi dan berkas identitas berada di `localStorage` tanpa enkripsi; jangan gunakan kata sandi atau KTP asli. Untuk penggunaan nyata, pindahkan autentikasi dan data ke backend dengan penyimpanan dokumen yang terlindungi.

Pengantaran dicatat sebagai pilihan layanan dan alamat saja; aplikasi tidak menyediakan kurir, pelacakan GPS, biaya kirim otomatis, atau pembayaran online. Pesanan dibuat untuk satu kantin dalam satu waktu.
