insta:@mochariel24
# WebView Fabric

Aplikasi React Native untuk menampilkan halaman web eksternal di dalam aplikasi menggunakan `react-native-webview` dan Fabric (New Architecture).

## Fitur

- Memuat `https://example.com` saat aplikasi dibuka.
- Kolom alamat untuk membuka halaman web lain.
- Tombol kembali, lanjut, dan muat ulang.
- Indikator proses pemuatan dan pesan saat halaman gagal dibuka.
- Tata letak menyesuaikan area aman layar Android dan iOS.

## Teknologi dan arsitektur

- React Native 0.88.0 dengan TypeScript.
- `react-native-webview` 16.x.
- New Architecture/Fabric aktif. Properti `newArchEnabled=true` tersedia di `android/gradle.properties`.
- Android memiliki izin `INTERNET` di `android/app/src/main/AndroidManifest.xml`.

React Native 0.88 berjalan dengan New Architecture saja. Properti Android tetap ditulis `true` agar pilihan arsitektur terlihat jelas di konfigurasi tugas.

## Menjalankan di Android

Pastikan Node.js 22.11 atau lebih baru dan JDK 17 tersedia. Di Android Studio SDK Manager, pasang Android SDK Platform 37, Android SDK Build-Tools 37.0.0, NDK (Side by side) 27.1.12297006, serta Android SDK Platform-Tools. Siapkan emulator atau perangkat Android dan pastikan `ANDROID_HOME` menunjuk ke folder SDK.

```powershell
npm install
npx react-native run-android
```

> Untuk menjalankan server Metro secara terpisah, gunakan `npm start` di terminal pertama, lalu `npm run android` di terminal kedua.

Untuk mencoba halaman lain, masukkan alamat seperti `https://reactnative.dev` atau `reactnative.dev` lalu tekan **BUKA**.

## Menjalankan di iOS

Di macOS dengan Xcode, pasang dependency iOS lalu jalankan aplikasi:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

## Berkas utama

- `App.tsx`: antarmuka, kontrol browser, dan komponen `WebView`.
- `android/gradle.properties`: konfigurasi New Architecture Android.
- `package.json`: dependency dan perintah proyek.
