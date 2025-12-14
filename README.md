# 🚦 Bursa Trafik İhbar Hazırlayıcı (v1.1.0)

![Sürüm](https://img.shields.io/badge/version-1.1.0-blue)
![Lisans](https://img.shields.io/badge/license-MIT-green)
![Durum](https://img.shields.io/badge/status-stable-success)

**Bursa Trafik İhbar Hazırlayıcı**, vatandaşların trafik kuralı ihlallerini (hatalı park, kırmızı ışık vb.) kolayca raporlamalarını sağlamak amacıyla geliştirilmiş, **istemci tabanlı (client-side)** ve açık kaynaklı bir web aracıdır.

Bu proje, fotoğraflardaki EXIF verilerini okuyarak konum ve tarih bilgisini otomatik doldurur, resmi bir dilekçe metni oluşturur ve cihazınızın mail uygulamasına aktarır.

---

## 🚀 Özellikler

* **🔒 Tam Gizlilik:** Tüm işlemler tarayıcınızda gerçekleşir. Sunucuya hiçbir fotoğraf veya kişisel veri gönderilmez.
* **📍 Otomatik Konum (Reverse Geocoding):** Yüklenen fotoğrafın GPS verisini kullanarak (OpenStreetMap altyapısı ile) açık adresi otomatik bulur.
* **📅 EXIF Okuma:** Fotoğrafın çekildiği gerçek tarih ve saati otomatik olarak form alanlarına işler.
* **⚖️ Hukuki Dayanak:** Seçilen ihlal türüne göre (Örn: Kaldırım işgali), ilgili Karayolları Trafik Kanunu (KTK) maddesini (Örn: Madde 61/1-n) metne otomatik ekler.
* **📱 Mobil Uyumlu (PWA):** Mobil cihazlarda uygulama hissi verir, ana ekrana eklenebilir.
* **offline-first:** İnternet bağlantısı olmasa bile (harita servisi hariç) taslak oluşturabilir.

## 📂 Proje Yapısı

Proje, sürdürülebilirlik ve modülerlik esas alınarak yapılandırılmıştır:

```text
BursaTrafikDenetim/
├── index.html            # Ana arayüz (View)
├── manifest.json         # PWA yapılandırması
├── server.py             # Yerel geliştirme sunucusu
├── LICENSE               # MIT Lisans dosyası
├── README.md             # Proje dökümantasyonu
└── assets/
    ├── css/
    │   └── style.css     # Tailwind harici özelleştirmeler
    └── js/
        ├── app.js        # Ana uygulama mantığı
        ├── config.js     # Sabitler (Kanun maddeleri, API URL)
        └── utils.js      # Yardımcı fonksiyonlar (Tarih, GPS vb.)
````

## 🛠️ Kurulum ve Çalıştırma

Bu proje herhangi bir veritabanı veya backend kurulumu gerektirmez.

### Yöntem 1: Yerel Sunucu (Tavsiye Edilen)

Python yüklü bir bilgisayarda projeyi yerel ağda yayınlayıp telefonunuzdan erişebilirsiniz.

1.  Proje klasöründe terminal açın.
2.  Aşağıdaki komutu çalıştırın:
    ```bash
    python server.py
    ```
3.  Terminalde çıkan IP adresini (Örn: `http://192.168.1.XX:8000`) telefonunuzun tarayıcısına girin.

### Yöntem 2: Statik Hosting

`index.html` ve `assets` klasörünü GitHub Pages, Vercel veya Netlify gibi statik dosya sunucularına yükleyerek anında yayına alabilirsiniz.

## ⚠️ Yasal Uyarı (Disclaimer)

1.  **Resmi Uygulama Değildir:** Bu araç, Bursa Emniyet Müdürlüğü veya herhangi bir devlet kurumu ile ilişkili değildir. Sadece ihbar sürecini kolaylaştıran bir "metin editörü" görevi görür.
2.  **Kullanıcı Sorumluluğu:** Oluşturulan ihbarın doğruluğu, eklenen kanıtların gerçekliği ve gönderim işlemi tamamen kullanıcının sorumluluğundadır.
3.  **Kanıt Ekleme:** Tarayıcı güvenlik kısıtlamaları gereği, mail uygulaması açıldığında **fotoğraf/video eklerini kullanıcının manuel olarak eklemesi gerekmektedir.**

## 🤝 Katkıda Bulunma

Projeyi geliştirmek isterseniz:

1.  Bu depoyu (repository) forklayın.
2.  Yeni bir dal (branch) oluşturun (`git checkout -b ozellik/yeni-ozellik`).
3.  Değişikliklerinizi yapın ve commit'leyin.
4.  Dalınızı push'layın ve bir Pull Request oluşturun.

## 📄 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır. Detaylar için [LICENSE](https://www.google.com/search?q=LICENSE) dosyasına bakabilirsiniz.