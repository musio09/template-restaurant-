/* =============================================================================
   MENU RENDERING HELPERS — js/menu.js
   Pure HTML-string builders for menu cards, badges, empty & loading states.
   All values are escaped. DOM wiring lives in js/app.js.
   ============================================================================= */

(function (global) {
  "use strict";

  const MenuUI = {

    /* ----- utils ----- */

    escapeHtml(str) {
      return String(str == null ? "" : str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    /** Format a price according to data.currency. */
    formatPrice(amount, currency) {
      const c = currency || { symbol: "", position: "after", decimals: 0 };
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
        tags.push(`<span class="tag tag-veg"><span class="ic">🌿</span>Vegetarian</span>`);
      }
      if (item.spicy) {
        tags.push(`<span class="tag tag-spicy"><span class="ic">🌶️</span>Spicy</span>`);
      }
      return tags.length ? `<div class="tags">${tags.join("")}</div>` : `<div class="tags"></div>`;
    },

    /* ----- cards ----- */

    /**
     * One menu item card.
     * @param item  menu item object
     * @param qty   current quantity in cart
     * @param currency data.currency
     */
    cardHtml(item, qty, currency) {
      const e = this.escapeHtml;
      const soldOut = item.available === false;
      const price = this.formatPrice(item.price, currency);
      const media = `
        <div class="card-media">
          <img src="${e(item.image)}" alt="${e(item.name)}" loading="lazy">
          ${item.popular ? `<span class="badge-pop">★ Popular</span>` : ""}
          ${soldOut ? `<span class="soldout-tag">Sold out</span>` : ""}
        </div>`;
      const action = soldOut
        ? ""
        : (qty > 0 ? this.stepperHtml(item.id, qty) : this.addBtnHtml(item));

      return `
      <li class="card ${soldOut ? "is-soldout" : ""}" data-card="${e(item.id)}">
        ${media}
        <div class="card-body">
          <div class="card-title">
            <h4>${e(item.name)}${item.am ? `<span class="am">${e(item.am)}</span>` : ""}</h4>
            <span class="price">${e(price)}</span>
          </div>
          <p class="card-desc">${e(item.description)}</p>
          <div class="card-foot">
            ${this.tagsHtml(item)}
            <div class="action-slot">${action}</div>
          </div>
        </div>
      </li>`;
    },

    /** Circular gold "Add" button. */
    addBtnHtml(item) {
      const e = this.escapeHtml;
      return `
      <button class="add-btn" data-action="add" data-id="${e(item.id)}" aria-label="Add ${e(item.name)} to order">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
        Add
      </button>`;
    },

    /** Quantity stepper: − qty + */
    stepperHtml(id, qty) {
      const e = this.escapeHtml;
      return `
      <div class="stepper" role="group" aria-label="Quantity">
        <button data-action="dec" data-id="${e(id)}" aria-label="Decrease quantity">−</button>
        <span class="qty" aria-live="polite">${qty}</span>
        <button data-action="inc" data-id="${e(id)}" aria-label="Increase quantity">+</button>
      </div>`;
    },

    /** A whole category block (heading + grid of cards). */
    categoryHtml(category, items, cart, currency) {
      const e = this.escapeHtml;
      const cards = items
        .map((item) => this.cardHtml(item, cart.qty(item.id), currency))
        .join("");
      return `
      <section class="cat-block reveal" id="cat-${e(category.id)}" aria-label="${e(category.name)}">
        <div class="cat-head">
          <span class="cat-icon" aria-hidden="true">${category.icon || ""}</span>
          <h3>${e(category.name)}</h3>
          ${category.am ? `<span class="cat-am am">${e(category.am)}</span>` : ""}
          <span class="cat-count">${items.length} item${items.length === 1 ? "" : "s"}</span>
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
        <h4>No dishes found</h4>
        <p>Nothing matches “${e(query)}”. Try a different spelling — or browse the full menu.</p>
        <button class="btn btn-line" data-action="reset-search">Clear search</button>
      </div>`;
    },

    emptyCartHtml() {
      return `
      <div class="cart-empty">
        <div class="empty-ic" aria-hidden="true">🧺</div>
        <h4>Your mesob is empty</h4>
        <p>Browse the menu and add a few dishes — everything is made to be shared.</p>
        <button class="btn btn-gold" data-action="close-cart">Browse the menu</button>
      </div>`;
    },

    /* ----- cart drawer line ----- */

    cartLineHtml(line, currency) {
      const e = this.escapeHtml;
      const { item, qty, lineTotal } = line;
      return `
      <div class="cart-line" data-line="${e(item.id)}">
        <div class="cl-media"><img src="${e(item.image)}" alt=""></div>
        <div class="cl-body">
          <div class="cl-top">
            <h5>${e(item.name)}</h5>
            <span class="cl-total">${e(this.formatPrice(lineTotal, currency))}</span>
          </div>
          <span class="cl-sub">${e(this.formatPrice(item.price, currency))} each</span>
          <div class="cl-row">
            ${this.stepperHtml(item.id, qty)}
            <button class="cl-remove" data-action="remove" data-id="${e(item.id)}" aria-label="Remove ${e(item.name)}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6"/></svg>
              Remove
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
