import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["offline.html", "favicon.ico", "robots.txt"],
      manifest: {
        name: "skyzz.closet",
        short_name: "skyzz.closet",
        description:
          "Shop the latest collections at Our Store. Explore skirts, noon wear, and occasion wear with fast delivery and great quality.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          { src: "icons/icon-48x48.webp", sizes: "48x48", type: "image/webp" },
          { src: "icons/icon-72x72.webp", sizes: "72x72", type: "image/webp" },
          { src: "icons/icon-96x96.webp", sizes: "96x96", type: "image/webp" },
          { src: "icons/icon-128x128.webp", sizes: "128x128", type: "image/webp" },
          { src: "icons/icon-144x144.webp", sizes: "144x144", type: "image/webp" },
          { src: "icons/icon-152x152.webp", sizes: "152x152", type: "image/webp" },
          { src: "icons/icon-192x192.webp", sizes: "192x192", type: "image/webp" },
          { src: "icons/icon-256x256.webp", sizes: "256x256", type: "image/webp" },
          { src: "icons/icon-384x384.webp", sizes: "384x384", type: "image/webp" },
          { src: "icons/icon-512x512.webp", sizes: "512x512", type: "image/webp" },
        ],
      },
      workbox: {
        // fallback page only when offline
        navigateFallback: "/offline.html",
        navigateFallbackAllowlist: [
          /^\/$/,         // homepage
          /^\/products/,  // product pages
          /^\/about/,     // about page
        ],
        runtimeCaching: [
          {
            // HTML / app shell
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            },
          },
          {
            // API requests
            urlPattern: /^https:\/\/your-api-domain\.com\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 }, // 1 day
            },
          },
          {
            // Google Fonts
            urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 31536000 }, // 1 year
            },
          },
          {
            // Images
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: { maxEntries: 60, maxAgeSeconds: 2592000 }, // 30 days
            },
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ["react-slick"],
  },
});
