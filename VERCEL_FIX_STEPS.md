# Nexus Convert – Domain’i İngilizce Sürüme Bağlama (Net Çözüm)

## Sorun
- **nexusconvert.net** ve **nexus-convertapp.vercel.app** hâlâ Türkçe (eski deployment).
- İngilizce sürüm **nexus-convertapp-five.vercel.app** adresinde çalışıyor (az önce tekrar deploy edildi).

**Sebep:** İngilizce kod **berat-mert-hancerlis-projects** altındaki projede; nexusconvert.net ise büyük ihtimalle **başka bir projede** tanımlı.

---

## ✅ NET ÇÖZÜM (önce bunu yap)

1. **İngilizce sitenin projesini aç:**  
   **https://vercel.com/berat-mert-hancerlis-projects/nexus-convert.app**

2. **Settings** → **Domains** → **Add** ile ekle:  
   `nexusconvert.net` ve `nexus-convertapp.vercel.app`

3. "Domain already in use" derse: Önce **Türkçe sitenin** (nexusconvert.net’in açıldığı) projesinde **Settings → Domains**’ten bu domain’leri **Remove** et, sonra yukarıdaki projede tekrar ekle.

Bundan sonra bu domain’ler İngilizce sürümü gösterecek.

---

## Çözüm 1: Doğru projede yeni deployment’ı “Production” yap (en hızlı)

1. **Vercel’de domain’in bağlı olduğu projeyi aç**
   - https://vercel.com/dashboard
   - **nexusconvert.net**’in bağlı olduğu projeyi seç (muhtemelen “nexus-convert.app” veya “nexus-convert”).

2. **Deployments sekmesine git**
   - Sol menüden **Deployments**’e tıkla.
   - Üstte **“Production”** yazan filtreyi **“All”** veya **“Preview”** yap.
   - Listede **bugünkü tarihli** veya **“nexus-convertapp-five”** ile ilgili bir deployment görüyor musun kontrol et.

3. **İngilizce deployment’ı Production yap**
   - O deployment’ın sağındaki **üç nokta (⋯)** menüsüne tıkla.
   - **“Promote to Production”** seç.
   - Birkaç saniye sonra **nexusconvert.net** ve **nexus-convertapp.vercel.app** İngilizce sürümü göstermeli.

Eğer listede böyle bir deployment yoksa Çözüm 2’ye geç.

---

## Çözüm 2: CLI ile doğru projeye deploy et

CLI bazen farklı bir “scope/team” altına deploy eder. Domain’in bağlı olduğu projeye deploy etmek için:

1. **Domain’in bağlı olduğu projenin Project ID’sini bul**
   - Vercel’de **Türkçe sitenin** (nexusconvert.net’in) bağlı olduğu projeyi aç.
   - **Settings** → **General**.
   - Aşağı kaydır, **Project ID** (prj_ ile başlayan) kopyala.

2. **Proje bağlantısını bu projeye zorla ayarla**
   - Bu repoda `.vercel/project.json` dosyasını aç.
   - `projectId` değerini az önce kopyaladığın **Project ID** ile değiştir. Kaydet.

3. **Terminalde tekrar production deploy**
   ```bash
   cd "c:\Users\Arzu HANÇERLİ\nexus-convert"
   npx vercel --prod
   ```
   - Deploy bitince çıktıda hangi URL’e deploy edildiğini not et.

4. **Vercel’de Production’ı güncelle**
   - Aynı projede **Deployments**’e git.
   - En üstteki (yeni oluşan) deployment’ın **⋯** menüsünden **“Promote to Production”** seç.

Bu adımlardan sonra domain’ler İngilizce sürüme dönmeli.

---

## Çözüm 3: Domain’i İngilizce sürümün olduğu projeye taşı

Eğer “nexus-convertapp-five.vercel.app” farklı bir Vercel projesinde açılıyorsa:

1. **İngilizce sitenin projesini bul**
   - Tarayıcıda https://nexus-convertapp-five.vercel.app aç.
   - Vercel dashboard’da hangi projede bu URL’in geçtiğini bul (Deployments veya Domains’ten).

2. **Domain’i bu projeye ekle**
   - O projede **Settings** → **Domains**.
   - **Add** → **nexusconvert.net** yaz, ekle.
   - Vercel “domain zaten kullanımda” derse: önce **Türkçe sitenin** projesinde **Settings** → **Domains**’ten **nexusconvert.net**’i kaldır, sonra tekrar İngilizce projeye ekle.

3. **nexus-convertapp.vercel.app** için de aynı projede Domains’e ekle (veya zaten o projede varsa dokunma).

---

## Hızlı kontrol

- İngilizce sürüm: https://nexus-convertapp-five.vercel.app  
- Ana domain’ler (bu adımlardan sonra İngilizce olmalı):  
  https://nexusconvert.net  
  https://nexus-convertapp.vercel.app  

Önce **Çözüm 1**’i dene (Deployments → All → Promote to Production). Olmazsa **Çözüm 2** (Project ID + `vercel --prod` + Promote).
