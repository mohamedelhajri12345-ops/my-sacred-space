# My Sacred Space

ابنِ لي تطبيق ويب إسلامي شامل (PWA) بواجهة عربية RTL، بتصميم دافئ وروحاني (ألوان ترابية وذهبية، خطوط عربية أصيلة، انتقالات ناعمة، مؤثرات لمس/haptic عند التفاعل)، يعمل بالكامل أوفلاين (Service Worker + تخزين محلي) باستثناء ميزة الدردشة بالذكاء الاصطناعي. الخصائص المطلوبة:

القرآن الكريم: عرض كامل للنص القرآني (استخدم بيانات مفتوحة المصدر مخزّنة محليًا)، تفسير مبسط، بحث في الآيات، علامات مرجعية (bookmarks)، ومتابعة تقدم القراءة/الختمة. اجعل مشغل الصوت جاهزًا للتلاوات (حتى لو الملفات الصوتية تحتاج نت لاحقًا، صمم الواجهة والمنطق).

الأذكار والأدعية: أذكار الصباح والمساء وبعد الصلاة وأدعية مأثورة، مع عداد تسبيح تفاعلي بمؤثرات لمس واهتزاز.

مواقيت الصلاة: حساب مواقيت الصلاة حسب الموقع الجغرافي (استخدم مكتبة حساب فلكي مناسبة)، مع تخزين آخر موقع محليًا للعمل أوفلاين، وشاشة عد تنازلي للصلاة القادمة.

إشعارات الأذان: نظام تنبيهات/إشعارات محلية (Web Notifications) عند دخول وقت كل صلاة، مع إمكانية اختيار نوع التنبيه ووقت التذكير المسبق.

اتجاه القبلة: بوصلة تفاعلية باستخدام حساسات الجهاز (DeviceOrientation).

التقويم الهجري: تحويل هجري/ميلادي وعرض المناسبات الإسلامية المهمة.

زر عائم دائم فوق كل الشاشات لفتح "محادثة إسلامية بالذكاء الاصطناعي" (واجهة شات فقط الآن بدون ربط API حقيقي، ضع فيها رد تجريبي مؤقت، ونبّه المستخدم بوضوح أن هذه الميزة الوحيدة التي تحتاج اتصال إنترنت).

تصميم عام: وضع ليلي مريح، إحصائيات روحية بسيطة (streak للأذكار)، وضع "خشوع" يوقف الإشعارات وقت الصلاة، وشاشة رئيسية جميلة تجمع كل الميزات ببطاقات واضحة.

اجعل البنية منظمة بمكونات (components) منفصلة لكل ميزة لتسهيل التطوير لاحقًا، وابدأ ببناء نسخة أولى كاملة وعاملة من كل هذه الميزات.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6784ab6a-07ee-4458-b93f-747341b8427c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
