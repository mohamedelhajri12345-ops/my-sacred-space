// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        // ملفات العميل تُبنى داخل .output/public، ويجب أن يُنشر sw.js هناك ليكون متاحًا على /sw.js
        outDir: ".output/public",
        devOptions: { enabled: false },
        manifest: false,
        workbox: {
          globDirectory: ".output/public",
          importScripts: ["/notifications-sw.js"],
          globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2,json}"],
          globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"],
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: { cacheName: "html-nav", networkTimeoutSeconds: 4 },
            },
            {
              // بيانات القرآن والتفسير: عرض فوري من الكاش مع تحديث في الخلفية
              urlPattern: ({ url }) => url.pathname.startsWith("/data/"),
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "quran-data",
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // أصول البناء المُبصمة (hashed) — cache-first
              urlPattern: ({ url, sameOrigin }) =>
                sameOrigin && /\/(assets|_build)\//.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "app-shell-assets",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 90 },
              },
            },
            {
              // الأذان والتسجيلات الصوتية المحلية — cache-first ليعمل بدون إنترنت
              urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/audio/"),
              handler: "CacheFirst",
              options: {
                cacheName: "adhan-audio",
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ url }) => url.origin === "https://fonts.gstatic.com" || url.origin === "https://fonts.googleapis.com",
              handler: "CacheFirst",
              options: { cacheName: "google-fonts", expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 } },
            },
          ],
        },
      }),
    ],
  },
});
