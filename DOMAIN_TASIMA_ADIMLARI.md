# nexusconvert.net → İngilizce Siteye Bağlama (Domain Taşıma)

## Durum
- **nexusconvert.net** şu an **nexus-convert.app** projesine bağlı → Türkçe (eski) deployment.
- İngilizce sürüm **nexus-convert** projesine deploy edildi; domain orada yok.

## Çözüm: Domain'i İngilizce projeye taşı

### Adım 1 – Eski projeden domain'leri kaldır
1. Tarayıcıda **https://vercel.com** aç, giriş yap.
2. **nexusconvert.net**’in şu an açıldığı projeyi bul (muhtemelen **nexus-convert.app** veya **bmerthancerli's projects** altında).
3. O projeye tıkla → **Settings** → **Domains**.
4. **nexusconvert.net** ve **nexus-convertapp.vercel.app** yanındaki **⋯** veya **Remove** ile **ikisini de kaldır**.

### Adım 2 – İngilizce projeye domain'leri ekle
1. Sol üstten **scope**’u **Berat Mert Hancerli's projects** yap (veya CLI’da deploy ettiğin hesap).
2. Proje listesinden **nexus-convert** projesini aç (**.app** yok, sadece **nexus-convert**).
3. **Settings** → **Domains** → **Add**.
4. Sırayla ekle:
   - **nexusconvert.net**
   - **nexus-convertapp.vercel.app**
5. Vercel DNS talimatı verirse (nexusconvert.net için), domain sağlayıcında (GoDaddy, Cloudflare vb.) A veya CNAME kayıtlarını Vercel’in gösterdiği gibi ayarla.

### Adım 3 – Kontrol
- 2–5 dakika sonra **https://nexusconvert.net** ve **https://nexus-convertapp.vercel.app** adreslerini aç; İngilizce görünmeli.

---

**Özet:** Domain’i Türkçe projeden çıkar → İngilizce (nexus-convert) projeye ekle.
