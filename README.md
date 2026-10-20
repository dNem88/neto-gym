🚀 Astro – Cloudflare – Keystatic Starter (GOK Studio)
Високопроизводителен шаблон за уебсайтове с нулеви разходи за поддръжка, изграден с Astro 5, React 19 и Keystatic CMS. Архитектурата е оптимизирана за местни бизнеси и е напълно готова за деплой в Cloudflare Pages.

🚦 Getting Started
1️⃣ Clone & Install
Bash
git clone https://github.com/dNem88/KEYSTATIC-ASTRO-StarterTempate
cd your-repo
npm install
2️⃣ Local Development
Стартира сайта и Keystatic Admin UI едновременно:

Bash
npm run dev
🌍 Site: http://localhost:4321

🛠 Admin UI: [http://127.0.0.1:4321/keystatic](http://127.0.0.1:4321/keystatic)

---------------------------------------------------------------------------------------------------------------

🧩 Импортиране на шаблони (/templates)
Когато импортирате дизайн от templateN, следвайте тези правила за чиста интеграция:

✅ Какво да копирате: Всички файлове и папки от избрания шаблон (напр. page/template7).

❌ Какво да пропускате:

blog.astro

Всички съдържателни файлове (управляват се изцяло от Keystatic).

⚠️ Важна корекция (Breaking Fix):

В текущия шаблон задължителен за правилното функциониране на блога е файлът:

pages/_components/sections/InnerPagesHeroSection.astro

Винаги заменяйте цялата папка components/ при импорт на нов шаблон.

Импортирай вече копираните Header и Footer (ако има)

---------------------------------------------------------------

📰 Адаптация на Blog секцията (Sanity → Keystatic)
Оригиналните лендинг пейдж шаблони използват Sanity за секцията „Latest Posts“. Тази логика трябва да се пренапише за Keystatic с помощта на Keystatic Reader за постигане на SSG, нулеви runtime заявки и перфектно SEO:

TypeScript
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);
const posts = await reader.collections.posts.all();
🎨 Стилизация и брандиране
🎯 Цветова схема: Дефинирайте всички основни цветове централизирано в src/styles/globals.css с помощта на :root, вместо да редактирате класове по отделните страници.

✍️ Шрифтове: Използвайте @fontsource-variable/raleway (^5.3.0) за най-бързо зареждане, локални файлове и липса на външни заявки.

🧹 Почистване: Класът .color може да бъде премахнат — той съществува единствено за демонстрационни цели в оригиналните шаблони.

🔗 Навигация и футър: След импорт на шаблон коригирайте URL адресите в Header-а, Footer-а и вътрешните линкове към блога и услугите.

🚀 Production Flow: Настройка на нов клиентски проект
1️⃣ GitHub Repository
Използвайте опцията “Use this template” или клонирайте репозиторието.

Инсталирайте зависимостите: npm install.

Добави .env файл (може да го копираш от локалната папка на темплейта, няма го в Github и при клонирането нямаш .env)

2️⃣ Keystatic Cloud
Влезте в Keystatic Cloud.

Създайте нов проект, свързан с вашето GitHub репозиторий.

Копирайте получения Project ID (напр. gok-studio/client-x).

Обновете keystatic.config.ts:

TypeScript
cloud: {
  project: 'gok-studio/име-на-проект'
}
3️⃣ Cloudflare Pages (Deploy)
Свържете GitHub репозиторието с Cloudflare Pages.

Build command: npm run build

Output directory: dist

🚀 Готово! Сайтът е live, CMS-ът е Git-базиран и няма никакви месечни такси.

📧 Email Setup & Security
За гарантиране на висока мащабируемост и надеждност:

Authentication: Винаги валидирайте целия домейн на клиента в Mailjet чрез DKIM и SPF записи.

Environment Isolation: Всеки проект в Cloudflare Pages трябва да разполага със собствени MAILJET_API_KEY и MAILJET_SECRET_KEY в секцията Settings -> Variables.

Spam Prevention: Всички контактни форми трябва да интегрират Cloudflare Turnstile за защита на общата репутация на акаунта.

⚡ Защо Keystatic вместо Sanity?
Keystatic е стратегически избор за изграждане на бързи, SEO-ориентирани сайтове без външни зависимости:

💵 0 лв. разходи за инфраструктура — Без API лимити, такси за заявки или storage разходи.

🔍 Перфектно SEO (Sitemap + SSG) — Статиите се съхраняват като локални Markdown файлове и се индексират директно от Astro.

🐙 Git-базиран CMS — Съдържанието живее директно в GitHub репозиторието. Премествате проекта — премествате и цялата CMS.

⚡ Максимална скорост — Без API заявки по време на build, светкавично бърз TTFB и максимални резултати в Lighthouse.

🧠 Подходящ за: Малки и средни бизнеси, SEO-ориентирани уебсайтове, локални услуги, статични блогове и дълготрайни проекти с минимални нужди от поддръжка.

📌 Philosophy (GOK Studio)
Simple architecture.

Zero vendor lock-in.

Maximum performance.