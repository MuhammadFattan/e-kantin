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
- Pembeli mengisi nomor telepon saat checkout dan dapat memilih bayar di tempat atau QRIS. Pemilik mengunggah QRIS di **Profil Kantin**; pembeli mengunduh QRIS, membayar, lalu wajib mengunggah screenshot. Pemilik memeriksa bukti secara manual sebelum pesanan dapat diproses.
- Pendaftaran meminta kode OTP demo yang ditampilkan di aplikasi. Kode ini hanya menguji alur input dan tidak dikirim, sehingga tidak membuktikan nomor telepon aktif.
- Pemilik memperbarui status order hingga pesanan selesai/diantar. Status siap terlihat di riwayat pesanan; notifikasi SMS/WhatsApp otomatis belum terhubung.

Tombol **Reset data demo** mengembalikan data contoh.

## Batasan demo

Login dan penyimpanan ini hanya simulasi client-side, bukan autentikasi produksi. Kata sandi, QRIS, bukti pembayaran, dan berkas identitas berada di `localStorage` tanpa enkripsi; jangan gunakan kata sandi atau KTP asli dan jangan menganggap bukti QRIS telah divalidasi oleh bank. OTP tidak dikirim dan pembayaran tidak diverifikasi otomatis. Untuk penggunaan nyata, pindahkan autentikasi, unggahan dokumen, verifikasi OTP, dan status pembayaran ke backend serta integrasikan penyedia WhatsApp dengan penyimpanan kredensial yang aman.

Pengantaran dicatat sebagai pilihan layanan dan alamat saja; aplikasi tidak menyediakan kurir, pelacakan GPS, atau biaya kirim otomatis. QRIS pada versi demo adalah gambar merchant statis, bukan QR pembayaran dinamis. Pesanan dibuat untuk satu kantin dalam satu waktu.
