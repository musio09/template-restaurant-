# 🍽️ Mesob — Traditional Restaurant QR Menu Template

A complete, **data-driven QR menu template** for traditional restaurants — built for
Ethiopian cuisine out of the box (demo restaurant: *Mesob · መሶብ*, Addis Ababa).
Zero dependencies, zero build step: plain HTML/CSS/JS you can host anywhere.

![Tech](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20Vanilla%20JS-b4812f)
![Dependencies](https://img.shields.io/badge/dependencies-0-3f7d2c)

---

## ✨ Features

**Customer experience**
- Warm premium hero with restaurant logo, name (English + Amharic), tagline and live **"Open now · closes 22:00"** status computed from the data file
- Sticky **search bar** + **category pill navigation** (with deep links, e.g. `#wot`)
- Beautiful **menu cards**: photo, name + Amharic name, description, price, **Popular / Vegetarian / Spicy** badges, sold-out state
- **Cart**: floating basket button, slide-in drawer, quantity +/−, remove, clear cart, subtotal/total, optional table number
- **Cart persistence** with `localStorage` (survives page reloads)
- **Order flow**: summary modal → send the order via **WhatsApp** or **call** the restaurant
- Professional **loading skeletons**, **empty search** and **empty cart** states, toast notifications
- Mobile-first, fully responsive, smooth scrolling, scroll-reveal animations, reduced-motion support, keyboard-friendly (Esc closes everything)

**Template engineering**
- **One file = one restaurant.** All content, prices, hours, colors and settings live in [`data/restaurant.js`](data/restaurant.js). No restaurant data anywhere else.
- **Themeable**: colors & border-radius in the data file are applied as CSS variables at runtime.
- No frameworks, no build tools — open `index.html` and it works.

---

## 📁 Project structure

```
├── index.html            → page skeleton (no restaurant data inside)
├── css/
│   └── style.css         → design system (tokens, layout, animations)
├── js/
│   ├── cart.js           → pure cart logic + localStorage (unit-testable)
│   ├── menu.js           → HTML builders: cards, badges, empty/loading states
│   └── app.js            → wiring: theme, search/filter, cart UI, ordering
├── data/
│   └── restaurant.js     → ⭐ ALL restaurant content & settings (edit me!)
└── assets/
    ├── logo.svg          → restaurant logo (replace with your own)
    └── img/              → food photography, hero & about images
```

---

## 🔧 Reusing the template for *your* restaurant (Restaurant #2)

1. **Copy the project folder.**
2. **Edit [`data/restaurant.js`](data/restaurant.js)** — it contains everything:

| Section      | What to change                                                        |
|--------------|-----------------------------------------------------------------------|
| `info`       | name, Amharic name, tagline, story, phone, WhatsApp, address, images  |
| `hours`      | opening hours per weekday (drives the live "Open now" badge)          |
| `socials`    | Instagram / Facebook / Telegram / TikTok / … links                    |
| `currency`   | symbol, position (`before`/`after`), decimals                         |
| `theme`      | all colors + card corner radius (applied live to the whole site)      |
| `ordering`   | WhatsApp/call ordering, table field, service charge %, cart note      |
| `categories` | category id, name, Amharic name, icon                                 |
| `items`      | dishes: name, description, price, image, badges, availability         |

3. **Replace the images** in `assets/` (logo + food photos). Use square-ish
   photos (~800×800, `.jpg`) for menu items and a wide photo for the hero.
4. Done — deploy anywhere (GitHub Pages, Netlify, any static host, or just
   open `index.html` from a phone).

> Tip: set a dish `"available": false` to show it as **Sold out**.

---

## 🚀 Running locally

No build needed. Either open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

Deep link straight to a category for QR codes per table/section:

```
index.html#wot        → opens filtered on the Wot category
index.html#tibs       → Tibs & Sauté
```

---

## 🧪 Testing the cart logic

`js/cart.js` is DOM-free and can be unit-tested in Node:

```bash
node -e "const Cart=require('./js/cart.js');const c=new Cart({storageKey:'t'});c.add('x');c.add('x');console.log(c.count())"
```

---

## 📝 License

Free to use and customize for your restaurant projects. Replace all demo
content (Mesob) before publishing for a real business.
