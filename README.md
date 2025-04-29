# Aigents SITE

The **aigents-site** repository hosts the user interface for Aigents, a proof-of-concept developed for the Microsoft AI Agents Hackathon (April 8–30, 2025). This project focuses on the frontend experience, delivering an interactive app that coordinates real-time AI agents for **search**, **comparison**, and **news** related to vehicles.

---

## 🛠️ Prerequisites

Before you begin, ensure you have:

- **Node.js** v18.x or higher
- **pnpm** (recommended): install via `npm install -g pnpm`
- A modern browser with WebSocket and Web Audio API support

---

## 🚀 Installation & Running

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/aigents-site.git
   cd aigents-site
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   Create a `.env` file based on `.env.example` and set:

   ```ini
   VITE_API_HOST=localhost:7000
   VITE_WS_PROTOCOL=ws
   ```

4. **Development mode**

   ```bash
   pnpm dev
   ```

   Open `http://localhost:3000` in your browser to try the app.

5. **Build & preview production**

   ```bash
   pnpm build
   pnpm preview
   ```

---

## ⚙️ Project Structure

```text
components/         # Reusable Vue components
 ├─ SessionManager.vue      # Manages session start/stop
 ├─ ConversationComponent.vue# Handles audio streaming
 ├─ NotificationPopup.vue   # Listens for session events
 ├─ events/                 # Result panels (Automobile, Comparison, News, Providers, Searching)
 └─ ui/                     # Generic buttons, selectors, modal wrappers

pages/              # Nuxt pages
 └─ index.vue       # Entry point: renders SessionManager

composables/        # Custom composables (e.g., useMarkdown)

types/              # TypeScript types (Car, SessionEvent, Payloads)

plugins/            # Nuxt plugins (i18n, theme switching)

public/             # Static assets (images, icons)

nuxt.config.ts      # Main Nuxt configuration
```

---

## 🔍 Frontend Interaction Flow

1. **Session Initialization**

   - User clicks “Start Session” in `SessionManager`.
   - App calls `POST /session` and receives a `sessionId`.

2. **Audio Streaming**

   - `ConversationComponent` opens a WebSocket at `/ws/conversation?sessionId=`.
   - Captures microphone audio, converts it to PCM16, and sends chunks.
   - Receives response audio and plays it back in real time.

3. **Notification Subscription**

   - `NotificationPopup` connects to `/ws/notification` and sends:

     ```json
     { "action": "init", "sessionId": "..." }
     { "action": "subscribe", "event": "Automobile" }
     // ... other events
     ```

   - Depending on `event` and `payload`, the appropriate component is displayed:
     - `SearchingComponent` (loading spinner)
     - `AutomobileComponent` (vehicle specs)
     - `ComparisonComponent` (comparison table)
     - `NewsComponent` (articles list rendered as Markdown)
     - `ProvidersComponent` (providers list)

4. **Internationalization & Theming**
   - `LanguageSelector` toggles between `en` and `es`.
   - `toggleTheme` switches light/dark mode and persists the choice locally.

---

## Technologies

The technologies and their purpose within the project:
| Category | Main Technologies | Version | Usage in the Project |
| ---------------------------------- | ------------------------------------------------------------------------------ | ------------------------ | -------------------------------------------------------------------------------- |
| **Framework and SSR** | Nuxt 3, Vue 3, Vue Router | 3^, 3^, 4^ | Frontend foundation: server-side rendering, routing, and view composition |
| **Styling and Design System** | Tailwind CSS, @tailwindcss/vite, tailwind-merge, tw-animate-css, CVA, clsx | 4^, 4^, 3^, 1^, 0.7^, 2^ | Utility-first CSS system, dynamic class merging, and simple animations |
| **UI Components & Icons** | reka-ui, shadcn-nuxt, @iconify/vue, lucide-vue-next, @iconify-json/radix-icons | 2^, 2^, 4^, 0.488^, 1^ | Ready-to-use component libraries and scalable icon sets |
| **Media Optimization** | @nuxt/image, embla-carousel-vue | 1^, 8^ | Image loading and transformation, interactive carousel |
| **Content Sanitization** | dompurify | 3^ | Secure cleaning of dynamically generated HTML |
| **Internationalization & Theming** | @nuxtjs/i18n, @nuxtjs/color-mode | 9^, 3^ | Multilanguage support and light/dark mode management |
| **Dynamic Tables** | @tanstack/vue-table | 8^ | Creation and manipulation of advanced data tables |
| **Hooks & Reactive Utilities** | @vueuse/core | 13^ | Sets of composables for reusable reactive logic (scroll, storage, sensors, etc.) |

---

## ⚠️ Hackathon Notice

This repository is a **proof-of-concept** for the Microsoft AI Agents Hackathon (Apr 8–30, 2025). It will **not** be maintained beyond the event or evolved beyond the hackathon period.

## Participants

| Name                 |
| -------------------- |
| Nicolas A. Catalogna |
| Juan Carlos Quintero |
