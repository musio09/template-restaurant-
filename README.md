# ☕ Café QR Menu Template — Ethiopian · አማርኛ + English

A polished, **data-driven QR menu** built for Ethiopian cafés & restaurants
(demo: *Mesob · መሶብ*, Addis Ababa). A customer scans a QR code and lands
straight on a fast, mobile-first menu: **scan → browse → add → order via
WhatsApp or call.**

Zero dependencies, zero build step — plain HTML/CSS/JS you can host anywhere.

![Tech](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20Vanilla%20JS-b4812f)
![Dependencies](https://img.shields.io/badge/dependencies-0-3f7d2c)

---

## ✨ Highlights

**Menu-first experience**
- Compact branded header — food is visible on the **first screen**, even on small phones
- Sticky toolbar: instant **search** (matches both languages) + scrollable **category pills**
- **Bilingual cards**: Amharic name big, English name small underneath — or any two languages you like
- Big bold **ETB prices**, short one-line descriptions, Popular / Vegetarian (የጾም) / Spicy badges
- Sold-out state (`available: false`) — shown, but not orderable

**Ordering that just works**
- One tap to add; large **+ / − stepper** on the card itself
- Floating **order bar** always in thumb reach: *View Order · 3 · 1,520 Br*
- Slide-in cart: change quantity, remove lines, table number, subtotal & total
- **WhatsApp order** (pre-filled message) or call — no backend needed
- Cart survives page reloads (`localStorage`)

**Ethiopian market ready**
- ETB / Birr prices by default, proper Amharic rendering via Noto Sans Ethiopic
- **አማርኛ / English switch** built in (can be disabled) — choice is remembered
- Live **“Open now · closes 22:00”** badge computed from the hours you set

**Engineering**
- **One file = one café**: everything lives in [`data/restaurant.js`](data/restaurant.js)
- Interface language fully configurable (`ui.strings`) — nothing hard-coded
- Themeable at runtime: colors + corner radius from the data file
- **Database-ready**: rendering is a pure function of the data; plug in an API later without touching the UI (see below)
- Fast by default: preloaded hero, lazy-loaded compressed images, no frameworks, no heavy animation

---

## 📁 Project structure

```
├── index.html            → page skeleton (no restaurant data inside)
├── css/
│   └── style.css         → design system (tokens, layout, responsive)
├── js/
│   ├── cart.js           → pure cart logic + localStorage (unit-testable)
│   ├── menu.js           → HTML builders: bilingual cards, badges, states
│   └── app.js            → wiring: theme, language, search/filter, cart UI
├── data/
│   └── restaurant.js     → ⭐ ALL café content & settings (edit me!)
└── assets/
    ├── logo.svg          → café logo (replace with your own)
    └── img/              → food photography (~800px wide), hero & about images
```

---

## 🔧 Reusing the template for a new café

1. **Copy the project folder.**
2. **Edit [`data/restaurant.js`](data/restaurant.js)** — it contains everything:

| Section      | What to change                                                          |
|--------------|-------------------------------------------------------------------------|
| `info`       | name, Amharic name, tagline, story, phone, WhatsApp, address, images    |
| `hours`      | opening hours per weekday (drives the live “Open now” badge)            |
| `socials`    | Instagram / Facebook / Telegram / TikTok / … links                      |
| `currency`   | symbol, position (`before`/`after`), decimals                           |
| `theme`      | all colors + card corner radius (applied live to the whole site)        |
| `ordering`   | WhatsApp/call ordering, table field, service charge %, cart note        |
| `ui`         | interface language, አማርኛ/English switch, every label on the page       |
| `categories` | category id, `name` (big), `nameEn` (small), icon                       |
| `items`      | dishes: `name`, `nameEn`, `description`, `descriptionEn`, price, image, badges, availability |

3. **Replace the images** in `assets/` (logo + food photos). Landscape photos
   around **800px wide** are ideal for menu cards; keep the hero photo wide
   (~1280px) and compress before uploading.
4. Done — deploy anywhere (GitHub Pages, Netlify, any static host, or just
   open `index.html` from a phone).

> Tips: set a dish `"available": false` to show it as **Sold out**. Keep
> descriptions to one short line — the menu stays scannable.

---

## 🌍 Language (አማርኛ / English)

```js
ui: {
  defaultLang: "am",     // "am" | "en" — which language loads first
  switcher: true,        // false = hide the switch, always use defaultLang
  strings: { en: {...}, am: {...} }   // every button, label and message
}
```

- Item/category names: `name` is the primary (big) name, `nameEn` the small
  second line. The active language decides which is which — anything missing
  falls back gracefully.
- For a **single-language** menu set `switcher: false` and write your language
  into the string sets. You can replace English/Amharic with *any* language —
  it’s just text.

---

## 🔌 Connecting a database later

The UI renders purely from the data object. When you’re ready for dynamic
menus (no re-publishing to change a price), define one global before
`js/app.js`:

```html
<script>
  window.MENU_DATA_LOADER = () =>
    fetch("https://your-api/menu").then(r => r.json());
  // resolves with { items, categories } — same shape as in data/restaurant.js
</script>
```

The page renders instantly from the bundled file and refreshes when your API
responds. You can also call `QRMenu.setData(newData)` at any time from your own
code.

---

## 🚀 Running locally

No build needed. Either open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

Deep link straight to a category for QR codes per table/section:

```
index.html#wot        → opens filtered on the Wot (stews) category
index.html#tibs       → opens filtered on Tibs & Kitfo
```

---

## 🧪 Testing

`js/cart.js` is DOM-free and unit-testable in Node:

```bash
node -e "const Cart=require('./js/cart.js');const c=new Cart({storageKey:'t'});c.add('x');c.add('x');console.log(c.count())"
```

---

## 📝 License

Free to use and customize for your restaurant projects. Replace all demo
content (Mesob) before publishing for a real business.
