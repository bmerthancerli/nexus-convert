# Kesin çözüm: Yeni proje + domain taşıma

Eski projede deployment’lar tetiklenmiyor. Aynı repo’dan **yeni** bir Vercel projesi oluşturup domain’i oraya bağlayalım.

---

## Adım 1: Billing’i düzelt (önemli)
1. Vercel’de sağ üst **profil** → **Account Settings** (veya Billing).
2. **Billing** / **Payment** bölümünde **Update Address** (sarı uyarıdaki) tıkla.
3. Ödeme yöntemi ve adres bilgisini eksiksiz doldur, kaydet.
(Bazı hesaplarda eksik billing yeni deploy’ları engelliyor.)

---

## Adım 2: Yeni proje oluştur (Import)
1. **vercel.com** → giriş yap → **bmerthancerli's projects** (veya kendi hesabın) seçili olsun.
2. **Add New...** → **Project**.
3. **Import Git Repository** ekranında **bmerthancerli/nexus-convert.app** repo’sunu bul (GitHub’dan import).
4. **Import** tıkla.
5. **Project Name:** örneğin `nexus-convert-en` (veya istediğin isim). **Deploy** / **Continue** ile ilk deploy’u başlat.
6. Deploy bitene kadar bekle (birkaç dakika). Bu projede **main**’deki güncel (İngilizce) kod deploy olacak.

---

## Adım 3: Domain’i yeni projeye taşı
1. **Eski** projeye git: **nexus-convert.app** (hâlâ Türkçe olan).
2. **Settings** → **Domains** → **nexusconvert.net** ve **nexus-convertapp.vercel.app** yanındaki **Remove** ile kaldır.
3. **Yeni** projeye git (**nexus-convert-en** veya ne isim verdinse).
4. **Settings** → **Domains** → **Add** → sırayla **nexusconvert.net** ve **nexus-convertapp.vercel.app** ekle.
5. Vercel DNS talimatı verirse (nexusconvert.net için), domain sağlayıcında (GoDaddy vb.) A/CNAME kayıtlarını ona göre ayarla.

---

## Adım 4: Kontrol
- **nexusconvert.net** ve **nexus-convertapp.vercel.app** artık yeni projeyi gösterecek; site İngilizce olacak.
- İleride **main**’e her push’ta bu yeni projede otomatik deploy oluşacak.

---

**Özet:** Billing’i düzelt → Aynı repo’dan yeni proje import et → Domain’i eski projeden kaldır, yeni projeye ekle.
