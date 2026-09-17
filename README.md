# Hola Bots
مشروع حقيقي قابل للتشغيل والتطوير: React/Vite + Express + SQLite + Discord OAuth2 + discord.js.

## التشغيل
1. انسخ `.env.example` إلى `.env`.
2. ضع SESSION_SECRET عشوائيًا طويلًا.
3. أنشئ ENCRYPTION_KEY بطول 64 حرف hex (32 بايت).
4. في Discord Developer Portal ضع Redirect URI:
   `http://localhost:3000/api/auth/discord/callback`
5. ضع Client ID وClient Secret.
6. شغّل `npm install`
7. شغّل `npm run build`
8. شغّل `npm start`

للتطوير: `npm run dev`

## Discord
OAuth2 يستخدم scope `identify` فقط. البوتات نفسها يجب إنشاؤها يدويًا في Discord Developer Portal ثم إدخال Client ID وBot Token في Hola Bots.

## الأمان
- التوكن لا يعاد إلى الواجهة بعد الحفظ.
- التوكن مشفر AES-256-GCM في قاعدة البيانات.
- مفتاح التشفير من Environment Variable.
- قاعدة البيانات Persistent داخل `data/hola-bots.sqlite`.
- Owner يحدد من Backend عند أول حساب فقط.
- صلاحيات API الإدارية تفحص في Backend.
- Member محدود بـ5 بوتات، وOwner غير محدود.
- ملكية البوت مفروضة في Backend.

## الاختبار
`npm test` يفحص بنية المشروع، وجود طبقة التشفير، وعدم وجود تخزين للتوكن في واجهة العميل.
اختبار OAuth واتصال البوتات فعليًا يحتاج بيانات Discord الخاصة بك، لذلك لا يعتبر اختبار End-to-End قبل إدخالها.
