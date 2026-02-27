# İki Vercel Hesabı – Tam Çözüm Rehberi

## Mevcut Durum

### Hesap 1: bmerthancerli (bmerthancerlis-projects)
- **Proje:** nexus-convert.app
- **Domain:** nexus-convertapp.vercel.app (Vercel subdomain)
- **nexusconvert.net:** Bu hesapta **görünmüyor** (farklı projede olabilir veya kaldırılmış olabilir)

### Hesap 2: Berat Mert Hancerli (berat-mert-hancerlis-projects)
- **Proje 1:** nexus-convert → **nexus-convert.vercel.app**
- **Proje 2:** nexus-convert.app → **nexus-convertapp-five.vercel.app**
- **Domain:** nexusconvert.net şu an bu hesaplardan birinde olmalı (genelde bmerthancerli’de)

---

## Hedef (Tek Hesap, Tek Proje)

1. **Tek Vercel hesabı** kullanmak
2. **nexusconvert.net** → güncel kodun deploy edildiği projeye bağlı olacak
3. Her push’ta otomatik deploy çalışacak

---

## Önce: Hangi Projede Güncel Kod Var?

**Yap:** Her iki hesaptaki projelerin Vercel URL’lerini tarayıcıda aç:

| Hesap | Proje | URL | FFmpeg Tools var mı? |
|-------|-------|-----|----------------------|
| Berat Mert Hancerli | nexus-convert | nexus-convert.vercel.app | ? |
| Berat Mert Hancerli | nexus-convert.app | nexus-convertapp-five.vercel.app | ? |

**FFmpeg Tools** (AVI to MP4, MKV to MP4 vb.) **hangi URL’de** görünüyorsa, güncel kod orada. O projeye domain’i bağlayacaksın.

---

## Adım 1: nexusconvert.net Nerede?

**bmerthancerli** hesabında:
1. Sol menüden **Domains** (proje değil, hesap seviyesinde) veya her projeyi tek tek aç
2. **nexus-convert.app** → Settings → Domains
3. **nexus-convert-app** varsa onu da kontrol et

**nexusconvert.net** hangi projede/hesapta görünüyorsa not et. Domain’i **oradan kaldıracaksın**.

---

## Adım 2: Hangi Hesabı Kullanacağına Karar Ver

**Öneri:** **Berat Mert Hancerli** hesabını kullan. Çünkü:
- nexus-convert ve nexus-convert.app burada
- CLI deploy’lar bu hesaba gidiyordu
- Güncel kod büyük ihtimalle burada

---

## Adım 3: Domain Taşıma (Sırayla)

### 3.1 Eski hesaptan kaldır
1. **bmerthancerli** ile giriş yap
2. nexusconvert.net’in bağlı olduğu projeyi bul (nexus-convert-app veya nexus-convert.app)
3. O proje → **Settings** → **Domains**
4. **nexusconvert.net** → **⋯** → **Remove**

### 3.2 Yeni hesaba ekle
1. **Berat Mert Hancerli** ile giriş yap (farklı tarayıcı veya çıkış yapıp giriş)
2. Güncel kodu gösteren projeyi aç:
   - **nexus-convert** (nexus-convert.vercel.app) VEYA
   - **nexus-convert.app** (nexus-convertapp-five.vercel.app)
3. O proje → **Settings** → **Domains** → **Add**
4. **nexusconvert.net** yaz → **Add**
5. DNS talimatlarını uygula (domain sağlayıcında A veya CNAME ekle)

---

## Adım 4: Git Bağlantısını Kontrol Et

Domain’i eklediğin projede:
1. **Settings** → **Git**
2. **bmerthancerli/nexus-convert.app** veya **nexus-convert** repo’su bağlı mı kontrol et
3. Bağlı değilse: **Connect** → GitHub → doğru repo’yu seç
4. Böylece her push otomatik deploy tetikleyecek

---

## Adım 5: Gereksiz Projeleri Temizle (İsteğe Bağlı)

**bmerthancerli** hesabında:
- Domain’i kaldırdıktan sonra **nexus-convert-app** veya **nexus-convert.app** projesini silebilirsin (artık kullanmayacaksan)
- Veya bırakabilirsin; sadece domain’in bağlı olmaması yeterli

**Berat Mert Hancerli** hesabında:
- **nexus-convert** ve **nexus-convert.app** ikisi de varsa, domain’i eklediğin birini kullan
- Diğerini silebilir veya bırakabilirsin

---

## Kontrol Listesi

- [ ] nexusconvert.net hangi hesapta/projede, tespit edildi
- [ ] Güncel kod hangi projede (FFmpeg Tools ile kontrol edildi)
- [ ] Eski hesaptan nexusconvert.net kaldırıldı
- [ ] Yeni hesapta doğru projeye nexusconvert.net eklendi
- [ ] DNS ayarları yapıldı (gerekirse)
- [ ] Git bağlı, push ile deploy test edildi
- [ ] nexusconvert.net güncel siteyi gösteriyor

---

## Kısa Özet

| Ne | Nerede |
|----|--------|
| Eski hesap (domain’i kaldır) | bmerthancerli |
| Yeni hesap (domain’i ekle) | Berat Mert Hancerli |
| Hedef proje | nexus-convert VEYA nexus-convert.app (hangisinde güncel kod varsa) |
| Domain | nexusconvert.net |

Tek hesap, tek proje, domain doğru yerde = karışıklık biter.
