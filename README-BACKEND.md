# Rose Glow Salon - Frontend + Backend

تمت إضافة Backend للمشروع باستخدام Node.js و Express.

## الملفات الجديدة المهمة

- `server.js`: سيرفر الـ Backend وملفات الـ API.
- `backend/data/db.json`: ملف تخزين البيانات للحسابات والحجوزات.
- `src/hooks/use-auth.tsx`: تم تعديله ليتصل بالـ Backend بدل Local Storage.

## تشغيل المشروع كامل

افتحي Terminal داخل مجلد المشروع ثم اكتبي:

```bash
npm install --legacy-peer-deps
npm run dev:full
```

بعدها افتحي الموقع:

```bash
http://localhost:8080
```

والـ Backend يعمل على:

```bash
http://localhost:4000/api/health
```

## تشغيل كل جزء لوحده

Terminal 1:

```bash
npm run backend
```

Terminal 2:

```bash
npm run dev:frontend
```

## ماذا تمت إضافته؟

- تسجيل حساب جديد من Backend.
- تسجيل دخول من Backend.
- حفظ الحجوزات في ملف بيانات داخل السيرفر.
- عرض حجوزات المستخدم من السيرفر.
- إلغاء الحجز من السيرفر.
- منع حجز نفس الأخصائية في نفس التاريخ والوقت.
- تذكير إيميل تجريبي يظهر في Terminal عند إنشاء الحجز.

ملاحظة: الدفع الإلكتروني والإيميل الحقيقي يحتاجان حسابات خارجية مثل Stripe و Gmail/SendGrid، لذلك الموجود الآن جاهز كمحاكاة مناسبة للمشروع الجامعي.
