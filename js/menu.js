/* =============================================================================
   MENU RENDERING HELPERS — js/menu.js
   Pure HTML-string builders for menu cards, badges, empty & loading states.
   All values are escaped. DOM wiring lives in js/app.js.

   Language: js/app.js calls MenuUI.setLanguage(lang, uiConfig) before
   rendering. Builders then pick the primary name/description for the active
   language and show the other language small underneath (e.g. Amharic big,
   English small).
   ============================================================================= */

(function (global) {
  "use strict";

  const MenuUI = {

    /* ----- language ----- */

    lang: "en",
    S: null, // ui.strings object from the config

    setLanguage(lang, ui) {
      this.lang = lang === "en" ? "en" : (lang || "en");
      this.S = (ui && ui.strings) || null;
    },

    /** Translate a key with {token} replacement: T("addedToast", {name:"ዶሮ ወጥ"}) */
    T(key, vars) {
      let str;
      if (this.S) {
        const active = this.S[this.lang];
        if (active && active[key] != null) str = active[key];
        else {
          const otherKey = Object.keys(this.S).find((k) => k !== this.lang);
          const other = otherKey && this.S[otherKey];
          if (other && other[key] != null) str = other[key];
        }
      }
      if (str == null) str = key; // last resort: show the key, never crash
      return String(str).replace(/\{(\w+)\}/g, (m, k) =>
        vars && vars[k] != null ? String(vars[k]) : m);
    },

    /** Primary name for the active language (falls back gracefully). */
    nameFor(item) {
      if (this.lang === "en" && item.nameEn) return item.nameEn;
      return item.name || item.nameEn || "";
    },
    /** The other-language name, or "" when missing/identical. */
    subNameFor(item) {
      const a = item.name || "", b = item.nameEn || "";
      if (!a || !b || a === b) return "";
      return this.lang === "en" ? a : b;
    },
    /** Short description for the active language. */
    descFor(item) {
      if (this.lang === "en") return item.descriptionEn || item.description || "";
      return item.description || item.descriptionEn || "";
    },

    /* ----- utils ----- */

    escapeHtml(str) {
      return String(str == null ? "" : str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    /** Format a price according to data.currency.
        A price of null / undefined / "" means "not priced yet" — it is shown as
        a dash so the item can go live before its price is decided. */
    formatPrice(amount, currency) {
      const c = currency || { symbol: "", position: "after", decimals: 0 };
      if (amount === null || amount === undefined || amount === "") return "—";
      const n = Number(amount) || 0;
      const num = n.toLocaleString("en-US", {
        minimumFractionDigits: c.decimals || 0,
        maximumFractionDigits: c.decimals || 0,
      });
      return c.position === "before" ? `${c.symbol}${num}` : `${num} ${c.symbol}`;
    },

    /* ----- badges ----- */

    tagsHtml(item) {
      const tags = [];
      if (item.veg) {
        tags.push(`<span class="tag tag-veg"><span class="ic" aria-hidden="true">🌿</span>${this.T("veg")}</span>`);
      }
      if (item.spicy) {
        tags.push(`<span class="tag tag-spicy"><span class="ic" aria-hidden="true">🌶️</span>${this.T("spicy")}</span>`);
      }
      return tags.length ? `<div class="tags">${tags.join("")}</div>` : `<div class="tags"></div>`;
    },

    /* ----- cards ----- */

    /**
     * One menu item card:
     * photo | name (+ small second language) · price · short description · add.
     * @param item     menu item object
     * @param qty      current quantity in cart
     * @param currency data.currency
     */
    cardHtml(item, qty, currency) {
      const e = this.escapeHtml;
      const soldOut = item.available === false;
      const price = this.formatPrice(item.price, currency);
      const subName = this.subNameFor(item);
      const desc = this.descFor(item);

      const media = `
        <div class="card-media">
          <img src="${e(item.image)}" alt="${e(this.nameFor(item))}" loading="lazy" decoding="async" width="800" height="436">
          ${item.popular && !soldOut ? `<span class="badge-pop">★ ${this.T("popular")}</span>` : ""}
          ${soldOut ? `<span class="soldout-tag">${this.T("soldOut")}</span>` : ""}
        </div>`;

      const action = soldOut
        ? ""
        : (qty > 0 ? this.stepperHtml(item.id, qty) : this.addBtnHtml(item));

      const primaryLang = this.lang === "en" ? "en" : "am";
      const secondaryLang = primaryLang === "en" ? "am" : "en";

      return `
      <li class="card ${soldOut ? "is-soldout" : ""}" data-card="${e(item.id)}">
        ${media}
        <div class="card-body">
          <div class="card-title">
            <h4 lang="${primaryLang}">${e(this.nameFor(item))}</h4>
            <span class="price">${e(price)}</span>
          </div>
          ${subName ? `<p class="card-sub" lang="${secondaryLang}">${e(subName)}</p>` : ""}
          ${desc ? `<p class="card-desc" lang="${primaryLang}">${e(desc)}</p>` : ""}
          <div class="card-foot">
            ${this.tagsHtml(item)}
            <div class="action-slot">${action}</div>
          </div>
        </div>
      </li>`;
    },

    /** Big, thumb-friendly gold "Add" button (≥44px tall on mobile). */
    addBtnHtml(item) {
      const e = this.escapeHtml;
      return `
      <button class="add-btn" data-action="add" data-id="${e(item.id)}" aria-label="${e(this.T("addAria", { name: this.nameFor(item) }))}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        <span>${this.T("add")}</span>
      </button>`;
    },

    /** Quantity stepper: − qty + (large tap targets) */
    stepperHtml(id, qty) {
      const e = this.escapeHtml;
      return `
      <div class="stepper" role="group" aria-label="${e(this.T("qtyAria"))}">
        <button data-action="dec" data-id="${e(id)}" aria-label="${e(this.T("decAria"))}">−</button>
        <span class="qty" aria-live="polite">${qty}</span>
        <button data-action="inc" data-id="${e(id)}" aria-label="${e(this.T("incAria"))}">+</button>
      </div>`;
    },

    /** A whole category block (heading + grid of cards). */
    categoryHtml(category, items, cart, currency) {
      const e = this.escapeHtml;
      const cards = items
        .map((item) => this.cardHtml(item, cart.qty(item.id), currency))
        .join("");
      const sub = this.subNameFor(category);
      const primaryLang = this.lang === "en" ? "en" : "am";
      return `
      <section class="cat-block" id="cat-${e(category.id)}" aria-label="${e(this.nameFor(category))}">
        <div class="cat-head">
          <span class="cat-icon" aria-hidden="true">${category.icon || ""}</span>
          <h3 lang="${primaryLang}">${e(this.nameFor(category))}</h3>
          ${sub ? `<span class="cat-am" lang="${this.lang === "en" ? "am" : "en"}">${e(sub)}</span>` : ""}
          <span class="cat-count">${e(this.T("itemCount", { n: items.length }))}</span>
        </div>
        <ul class="grid">${cards}</ul>
      </section>`;
    },

    /* ----- states ----- */

    skeletonHtml(count) {
      let cards = "";
      for (let i = 0; i < (count || 4); i++) {
        cards += `
        <li class="skel-card" aria-hidden="true">
          <div class="skel-media shimmer"></div>
          <div class="skel-lines">
            <div class="skel-line w60 shimmer"></div>
            <div class="skel-line w90 shimmer"></div>
            <div class="skel-line w40 shimmer"></div>
          </div>
        </li>`;
      }
      return `<div class="skel"><ul class="grid">${cards}</ul></div>`;
    },

    /** Shown when a search / filter yields nothing. */
    emptySearchHtml(query) {
      const e = this.escapeHtml;
      return `
      <div class="empty-state">
        <div class="empty-ic" aria-hidden="true">🔍</div>
        <h4>${this.T("noResultsTitle")}</h4>
        <p>${e(this.T("noResultsText", { q: query || "…" }))}</p>
        <button class="btn btn-line" data-action="reset-search">${this.T("clearSearchBtn")}</button>
      </div>`;
    },

    emptyCartHtml() {
      return `
      <div class="cart-empty">
        <div class="empty-ic" aria-hidden="true">🧺</div>
        <h4>${this.T("emptyCartTitle")}</h4>
        <p>${this.T("emptyCartText")}</p>
        <button class="btn btn-gold" data-action="close-cart">${this.T("browseMenuBtn")}</button>
      </div>`;
    },

    /* ----- cart drawer line ----- */

    cartLineHtml(line, currency) {
      const e = this.escapeHtml;
      const { item, qty, lineTotal } = line;
      return `
      <div class="cart-line" data-line="${e(item.id)}">
        <div class="cl-media"><img src="${e(item.image)}" alt="" loading="lazy" width="60" height="60"></div>
        <div class="cl-body">
          <div class="cl-top">
            <h5 lang="${this.lang === "en" ? "en" : "am"}">${e(this.nameFor(item))}</h5>
            <span class="cl-total">${e(this.formatPrice(lineTotal, currency))}</span>
          </div>
          <span class="cl-sub">${e(this.formatPrice(item.price, currency))}</span>
          <div class="cl-row">
            ${this.stepperHtml(item.id, qty)}
            <button class="cl-remove" data-action="remove" data-id="${e(item.id)}" aria-label="${e(this.T("removeAria", { name: this.nameFor(item) }))}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6"/></svg>
              ${this.T("remove")}
            </button>
          </div>
        </div>
      </div>`;
    },

    /* ----- social icons (footer) ----- */

    socialIconSvg(platform) {
      const paths = {
        instagram: `<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none"/>`,
        facebook: `<path d="M14.5 8.5h2.7V4.9h-2.7a3.9 3.9 0 0 0-3.9 3.9v2.2H8v3.6h2.6v6.5h3.6v-6.5h2.7l.5-3.6h-3.2V9a.6.6 0 0 1 .3-.5z" fill="currentColor" stroke="none"/>`,
        telegram: `<path d="M21.3 4.4 3.1 11.5c-.9.35-.85 1.6.08 1.87l4.5 1.35 1.7 5.35c.28.9 1.36 1.12 1.93.4l2.4-2.97 4.6 3.36c.73.53 1.76.13 1.93-.76l2.55-14.6c.18-1.02-.81-1.84-1.77-1.44z" fill="currentColor" stroke="none"/>`,
        tiktok: `<path d="M16.6 3c.36 2.02 1.72 3.44 3.9 3.66v3.13c-1.5 0-2.84-.46-3.97-1.3v5.83A5.88 5.88 0 1 1 10.6 8.5v3.2a2.76 2.76 0 1 0 2.75 2.76V3h3.25z" fill="currentColor" stroke="none"/>`,
        twitter: `<path d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21h-3l7.1-8.1L2 3h6.3l4.3 5.7L17.8 3z" fill="currentColor" stroke="none"/>`,
        youtube: `<path d="M22.5 12s0-3.3-.42-4.85a2.6 2.6 0 0 0-1.82-1.83C18.7 4.9 12 4.9 12 4.9s-6.7 0-8.26.42A2.6 2.6 0 0 0 1.92 7.15C1.5 8.7 1.5 12 1.5 12s0 3.3.42 4.85a2.6 2.6 0 0 0 1.82 1.83c1.56.42 8.26.42 8.26.42s6.7 0 8.26-.42a2.6 2.6 0 0 0 1.82-1.83c.42-1.55.42-4.85.42-4.85z" fill="currentColor" stroke="none"/><path d="m9.8 15.1 5.4-3.1-5.4-3.1v6.2z" fill="#17100a" stroke="none"/>`,
        website: `<circle cx="12" cy="12" r="9.2"/><path d="M2.8 12h18.4M12 2.8c-5.1 5.3-5.1 13.6 0 18.4 5.1-4.8 5.1-13.1 0-18.4z"/>`,
      };
      const body = paths[platform] || paths.website;
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">${body}</svg>`;
    },
  };

  global.MenuUI = MenuUI;
})(typeof window !== "undefined" ? window : globalThis);
