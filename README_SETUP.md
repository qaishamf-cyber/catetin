# CATETIN — Catat Uangnya, Kendalikan Maunya

Paket ini berisi aplikasi pencatatan keuangan pribadi CATETIN dengan integrasi Firebase Authentication dan Cloud Firestore, serta panduan deployment ke Vercel.

## Fitur dan cara kerja

- Registrasi dan login dengan email/password melalui Firebase Authentication.
- Profil pengguna, tujuan keuangan, pengaturan saldo/anggaran, dan transaksi disimpan di Cloud Firestore.
- Sinkronisasi langsung melalui listener Firestore; perubahan akun yang sama akan muncul di browser/perangkat lain saat online.
- Data lokal digunakan sebagai cache tampilan, bukan sebagai sumber utama saat Firebase berhasil dikonfigurasi.
- Setiap akun hanya dapat mengakses dokumen di `users/{uid}` miliknya sesuai Firestore Security Rules.

> **Penting:** proyek Firebase milikmu belum dibuat atau dikonfigurasi oleh paket ini. Kamu harus memasukkan konfigurasi Firebase sendiri dan menerbitkan Firestore Rules sebelum aplikasi bisa digunakan. Jangan masukkan data keuangan sungguhan sebelum langkah pengujian keamanan selesai.

## Isi paket

- `site/index.html` — antarmuka CATETIN dengan Firebase Authentication/Firestore SDK dan sinkronisasi.
- `site/firebase-config.js` — tempat mengisi konfigurasi Firebase Web App.
- `site/vercel.json` — header keamanan untuk Vercel.
- `site/_headers` — file header untuk host lain yang mendukung format Netlify.
- `firestore.rules` — aturan akses Firestore untuk profil, pengaturan, dan transaksi per pengguna.
- `README_SETUP.md` — panduan setup Firebase dan deployment.
- `CHANGELOG.txt` — catatan perubahan.

## Bagian A — Buat dan konfigurasi Firebase

### 1. Buat proyek Firebase

1. Buka https://console.firebase.google.com/ lalu pilih **Create a project / Add project**.
2. Beri nama, misalnya `catetin-app`, lalu selesaikan langkah pembuatan proyek.
3. Di halaman Project Overview, pilih ikon Web `</>` untuk mendaftarkan Web App. Beri nama `CATETIN Web`.
4. Salin konfigurasi Firebase Web App yang ditampilkan. Konfigurasi web berisi `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, dan `appId`.

### 2. Aktifkan login email/password

1. Buka **Build → Authentication → Get started**.
2. Di **Sign-in method**, pilih **Email/Password**, aktifkan, lalu simpan.
3. (Disarankan) Di Authentication → Settings, atur domain resmi website setelah deployment jika Firebase meminta domain yang diizinkan.

### 3. Buat Firestore Database

1. Buka **Build → Firestore Database → Create database**.
2. Pilih lokasi database yang sesuai dengan kebutuhan dan lokasi pengguna. Lokasi database tidak mudah diubah setelah dibuat.
3. Selesaikan pembuatan database. Jangan membiarkan aturan produksi terbuka untuk semua pengguna.

### 4. Masukkan konfigurasi ke file proyek

Buka `site/firebase-config.js`, lalu ganti seluruh nilai `ISI_...` dengan nilai konfigurasi Web App dari Firebase Console. Contoh bentuknya (gunakan nilai milik proyekmu, jangan salin nilai contoh):

```js
window.CATETIN_FIREBASE_CONFIG = {
  apiKey: "nilai-dari-firebase",
  authDomain: "project-id.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "nilai-dari-firebase",
  messagingSenderId: "nilai-dari-firebase",
  appId: "nilai-dari-firebase"
};
```

Simpan file. File ini memang dimuat oleh `index.html`; jangan mengubahnya menjadi `export const` kecuali kamu juga mengubah cara memuatnya. Firebase Web config bukan service-account private key, tetapi tetap atur akses data melalui Authentication dan Firestore Rules. Jangan pernah menaruh service-account JSON atau private key di frontend.

### 5. Terapkan Firestore Security Rules

1. Buka file `firestore.rules` di paket.
2. Firebase Console → **Firestore Database → Rules**.
3. Ganti aturan yang ada dengan isi file tersebut lalu klik **Publish**.
4. Jangan menghapus aturan penolakan default di akhir file. Aturan ini membatasi data berdasarkan UID pengguna yang sedang login.
5. Sebelum produksi, uji rules dengan Firebase Rules Playground atau Firebase Emulator Suite. Sesuaikan rules jika skema aplikasi diubah.

### 6. Periksa struktur data

Aplikasi menggunakan struktur berikut:

- `users/{uid}` — nama, email, data profil, dan tujuan keuangan.
- `users/{uid}/appData/settings` — saldo awal, anggaran, dan periode anggaran.
- `users/{uid}/transactions/{transactionId}` — setiap transaksi pemasukan/pengeluaran sebagai dokumen tersendiri.

Aplikasi tidak menyimpan password sendiri di Firestore; pengelolaan password dilakukan oleh Firebase Authentication.

## Bagian B — Deploy ke Vercel

### 1. Siapkan repositori GitHub

1. Ekstrak ZIP.
2. Buat repositori baru di GitHub, misalnya `catetin`.
3. Unggah isi folder `CATETIN_Launch_Pack` ke repositori. Pastikan folder `site` ada di root repositori dan berisi `index.html`, `firebase-config.js`, `vercel.json`, serta `_headers`.
4. Commit dan push perubahan, termasuk konfigurasi Firebase yang sudah diisi. Catatan: konfigurasi Firebase web boleh ada di frontend; keamanan data bergantung pada rules. Jangan commit kredensial admin.

### 2. Hubungkan ke Vercel

1. Buka https://vercel.com/ dan login.
2. Pilih **Add New → Project**, lalu impor repositori GitHub `catetin`.
3. Atur **Root Directory** menjadi `site`.
4. Pilih **Framework Preset: Other**. Untuk situs HTML statis ini, tidak perlu build command; jika Vercel meminta Output Directory, gunakan `.`.
5. Klik **Deploy** dan buka URL `.vercel.app` yang diberikan.
6. Setelah deploy, buka Firebase Console → Authentication → Settings → Authorized domains dan pastikan domain Vercel kamu diizinkan bila diperlukan.

Jika menggunakan custom domain, tambahkan domain itu di Vercel dan pastikan domain tersebut juga terdaftar di Authorized domains Firebase.

### 3. Update deployment

Setiap push/commit ke branch produksi GitHub akan memicu deployment baru jika integrasi Git Vercel aktif. Setelah mengubah `firebase-config.js`, lakukan commit/push dan periksa website yang sudah ter-deploy.

## Bagian C — Tes autentikasi dan sinkronisasi

Lakukan pengujian ini sebelum memasukkan data nyata:

1. Buka website CATETIN dan daftarkan akun uji dengan email yang bisa kamu akses.
2. Pastikan akun muncul di Firebase Console → Authentication → Users.
3. Tambahkan transaksi uji dan ubah anggaran. Periksa Firestore di `users/{uid}` dan subkoleksi `transactions` serta `appData/settings`.
4. Buka website di browser/perangkat kedua, login dengan akun yang sama, dan pastikan transaksi serta pengaturan yang tersimpan di cloud muncul.
5. Ubah satu transaksi di perangkat kedua dan pastikan perubahan tersinkron di perangkat pertama ketika keduanya online.
6. Daftarkan akun uji kedua. Pastikan akun kedua tidak dapat membaca dokumen akun pertama.
7. Coba edit, hapus, reload, logout, lalu login kembali. Periksa konsol browser dan Firebase Console jika terjadi error.

## Batasan dan catatan penting

- Sinkronisasi cloud membutuhkan koneksi internet dan konfigurasi Firebase yang benar. Cache lokal bukan pengganti backup cloud.
- Jika `firebase-config.js` masih berisi placeholder, aplikasi akan menampilkan pesan bahwa Firebase belum dikonfigurasi dan login/registrasi tidak dapat digunakan.
- Aplikasi menyinkronkan transaksi dengan koleksi Firestore dan pengaturan dengan satu dokumen. Hindari membuat batch transaksi sangat besar sekaligus; uji sesuai volume penggunaan yang direncanakan.
- Firestore memiliki biaya/kuota berdasarkan penggunaan. Pantau usage dan billing di Firebase Console.
- Aturan Firestore di paket merupakan baseline awal, bukan audit keamanan formal. Uji rules, validasi data, dan skenario pengguna sebelum produksi.
- `localStorage` menyimpan cache pada browser/perangkat. Data cloud tersedia di perangkat lain setelah login dengan akun Firebase yang sama dan koneksi internet aktif.
- Jangan masukkan informasi keuangan yang sangat sensitif sebelum aplikasi dan aturan akses diuji dengan benar.

## Dokumentasi resmi

- Firebase Web setup: https://firebase.google.com/docs/web/setup
- Firebase Authentication (password): https://firebase.google.com/docs/auth/web/password-auth
- Cloud Firestore: https://firebase.google.com/docs/firestore
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Vercel deployments: https://vercel.com/docs/deployments/overview
