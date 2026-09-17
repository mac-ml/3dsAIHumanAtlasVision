# 3DS Anatomical Vision

Web tabanlı, gerçek zamanlı insan anatomisi algılama ve dijital anatomi atlası.

## Kurulum ve Çalıştırma

Uygulama tamamen istemci tarafında (browser) çalışmaktadır ve MediaPipe Tasks Vision kullanmaktadır. Ancak kamera erişimi güvenlik nedeniyle `localhost` veya `https` üzerinden sunulmayı gerektirir.

### Lokal Geliştirme Sunucusu (Node.js ile)
Eğer sisteminizde Node.js yüklüyse, `http-server` veya `serve` kullanarak uygulamayı çalıştırabilirsiniz:

```bash
npx http-server .
```
Sonra tarayıcınızda `http://127.0.0.1:8080` adresine gidin.

### Kullanım

1. **Start Camera** butonuna basarak kamera erişimine izin verin.
2. Kamera açıldıktan sonra MediaPipe modelleri yüklenecektir.
3. Ekranda beliren omuz, burun, göğüs gibi algılanmış bölgelere (renkli noktalar) tıklayın.
4. Sağ panelde o bölgeye ait anatomik bilgileri (Latince isim, kategori, açıklama vb.) görebilirsiniz.

## Not
MVP sürümü MediaPipe CDN bağımlılığına sahiptir, çalışmak için internet bağlantısı gerektirir. İlk yüklemede modellerin indirilmesi birkaç saniye sürebilir.
