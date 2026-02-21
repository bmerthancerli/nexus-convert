# Sorun: Push'lar Vercel'de yeni deployment oluşturmuyor

## Tespit
- **Proje doğru:** bmerthancerlis-projects / nexus-convert.app
- **Hesap doğru:** bmerthancerli
- **Sorun:** Vercel, GitHub repo **bmerthancerli/nexus-convert.app** için sadece 14 Şubat'taki ilk push'ta deploy yaptı. Sonraki tüm push'lar (İngilizce çeviri dahil) yeni deployment oluşturmadı → Production hâlâ "Initial commit" (Türkçe).

## Çözüm: Git bağlantısını yenile

### Adım 1 – Vercel'de Git'i yeniden bağla
1. **https://vercel.com/bmerthancerlis-projects/nexus-convert.app** aç.
2. **Settings** (üst menü) → sol menüden **Git**.
3. **Disconnect** (Git bağlantısını kaldır).
4. Tekrar **Connect Git Repository** → **GitHub** seç → **bmerthancerli/nexus-convert.app** repo'sunu seç (veya listede varsa **nexus-convert.app**).
5. Bağlantı kurulunca **Production Branch** olarak **main** kalsın, kaydet.

### Adım 2 – Yeni deployment tetikle
Bağlantıdan sonra Vercel bazen "Deploy now" veya son commit’i deploy etme seçeneği sunar. Varsa **Deploy** / **Redeploy** de.

Yoksa:
- **Deployments** sekmesine git.
- Sağ üstte **Redeploy** veya **Deploy** butonu varsa tıkla; "Use existing Build Cache" işaretini **kapat** (temiz build için).
- Veya: Proje **Settings → Git** sayfasında "Redeploy with latest commit" benzeri bir seçenek varsa onu kullan.

### Adım 3 – Kontrol
- **Deployments** listesinde **yeni** bir deployment (bugünün tarihi, "Trigger Vercel deploy" veya son commit mesajı) görünmeli.
- Bu deployment **Ready** olunca Production’a alınır (veya zaten Production ise) **nexusconvert.net** İngilizce açılmalı.

---

**Özet:** Proje ve hesap doğru; GitHub push’ları Vercel’e ulaşmıyor. Git’i Disconnect → Connect yap, sonra yeni deploy tetikle.
