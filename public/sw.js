/**
 * Service Worker للتطبيق الإسلامي - أحلام الروض
 * يتعامل مع الإشعارات والذاكرة المؤقتة والعمل بدون إنترنت
 */

const CACHE_NAME = 'ahlaam-alrooh-v1';
const OFFLINE_URL = '/';

// الأصول المراد تخزينها مؤقتاً
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
];

// تهيئة Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// التعامل مع الطلبات
self.addEventListener('fetch', (event) => {
  // تجاهل طلبات API
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // لا تخزن استجابات غير صالحة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // استنساخ الاستجابة للتخزين
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // إرجاع صفحة أوفلاين إذا كانت موجودة
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return new Response('غير متصل بالإنترنت', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// التعامل مع الإشعارات
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // التركيز على النافذة الموجودة إن وجدت
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // فتح نافذة جديدة
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data?.url || '/');
        }
      })
  );
});

// التعامل مع إشعارات التنبيه
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag);
});

// التعامل مع الرسائل من التطبيق
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data.type);

  switch (event.data.type) {
    case 'SCHEDULE_PRAYER_NOTIFICATION':
      schedulePrayerNotification(
        event.data.prayerName,
        event.data.prayerTime,
        event.data.reminderMinutes
      );
      break;

    case 'SHOW_INSTANT_NOTIFICATION':
      showInstantNotification(
        event.data.title,
        event.data.body,
        event.data.options
      );
      break;

    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    default:
      console.log('[SW] Unknown message type:', event.data.type);
  }
});

/**
 * جدولة إشعارات الصلاة
 */
function schedulePrayerNotification(prayerName, prayerTime, reminderMinutes = 10) {
  const now = new Date();
  const prayerDate = new Date(prayerTime);
  
  console.log('[SW] Scheduling prayer notification:', {
    prayerName,
    prayerTime: prayerDate,
    reminderMinutes
  });

  // إشعار التذكير قبل الصلاة
  if (reminderMinutes > 0) {
    const reminderTime = new Date(prayerDate.getTime() - reminderMinutes * 60000);
    const reminderDelay = reminderTime.getTime() - now.getTime();
    
    if (reminderDelay > 0) {
      console.log('[SW] Scheduling reminder for:', new Date(now.getTime() + reminderDelay));
      setTimeout(() => {
        showPrayerNotification(prayerName, `تبقى ${reminderMinutes} دقيقة على صلاة ${prayerName}`, 'reminder', reminderMinutes);
      }, reminderDelay);
    }
  }
  
  // إشعار الأذان
  const adhanDelay = prayerDate.getTime() - now.getTime();
  if (adhanDelay > 0) {
    console.log('[SW] Scheduling adhan for:', new Date(now.getTime() + adhanDelay));
    setTimeout(() => {
      showPrayerNotification(prayerName, `حان الآن وقت صلاة ${prayerName}`, 'adhan', reminderMinutes);
    }, adhanDelay);
  }
}

/**
 * إظهار إشعار الصلاة
 */
function showPrayerNotification(prayerName, message, type, reminderMinutes) {
  const icons = {
    adhan: '/icons/icon-192.png',
    reminder: '/icons/icon-192.png'
  };

  const vibrationPatterns = {
    adhan: [300, 100, 300, 100, 300],
    reminder: [200, 100, 200]
  };

  self.registration.showNotification(`🕌 ${prayerName}`, {
    body: message,
    icon: icons[type],
    badge: '/icons/icon-192.png',
    vibrate: vibrationPatterns[type],
    tag: `${type}-${prayerName}`,
    requireInteraction: type === 'adhan',
    silent: false,
    data: {
      url: '/prayer',
      prayerName,
      type,
      reminderMinutes
    },
    actions: [
      { action: 'open', title: 'فتح التطبيق' },
      ...(type === 'reminder' ? [{ action: 'snooze', title: 'تذكير بعد 5 دقائق' }] : [])
    ]
  });

  // تشغيل صوت الأذان للأذان
  if (type === 'adhan') {
    playAdhanSound();
  }
}

/**
 * إظهار إشعار فوري
 */
function showInstantNotification(title, body, options = {}) {
  self.registration.showNotification(title, {
    body,
    icon: options.icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    tag: options.tag || title,
    requireInteraction: options.requireInteraction || false,
    silent: options.silent || false,
    data: options.data,
    ...options
  });
}

/**
 * تشغيل صوت الأذان
 */
async function playAdhanSound() {
  try {
    // محاولة فتح نافذة التطبيق لتشغيل الصوت
    const clients = await self.clients.matchAll({ type: 'window' });
    if (clients.length > 0) {
      clients[0].postMessage({
        type: 'PLAY_ADHAN_SOUND',
        soundType: 'adhan'
      });
    }
  } catch (error) {
    console.error('[SW] Error playing adhan:', error);
  }
}

// التعامل مع Push Notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  let data = {
    title: 'إشعار جديد',
    body: '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'push',
    requireInteraction: false,
    silent: false
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      data = {
        ...data,
        ...payload
      };
    } else if (event.data) {
      data.body = event.data.text();
    }
  } catch (error) {
    console.error('[SW] Error parsing push data:', error);
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [200, 100, 200],
    tag: data.tag,
    requireInteraction: data.requireInteraction,
    silent: data.silent,
    data: data.data,
    actions: data.actions || [
      { action: 'open', title: 'فتح' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// مزامنة في الخلفية
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-prayers') {
    event.waitUntil(syncPrayers());
  }
});

async function syncPrayers() {
  try {
    const clients = await self.clients.matchAll({ type: 'window' });
    if (clients.length > 0) {
      clients[0].postMessage({
        type: 'SYNC_PRAYERS'
      });
    }
  } catch (error) {
    console.error('[SW] Error syncing prayers:', error);
  }
}

console.log('[SW] Service Worker loaded');
