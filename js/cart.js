/* =============================================================================
   CART LOGIC — js/cart.js
   Pure cart state + localStorage persistence. No DOM access here, so it can be
   unit-tested in Node. The UI wiring lives in js/app.js.
   ============================================================================= */

(function (global) {
  "use strict";

  /** In-memory fallback storage (private mode, Node tests, etc.). */
  function memoryStorage() {
    const map = new Map();
    return {
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => map.set(k, String(v)),
      removeItem: (k) => map.delete(k),
    };
  }

  class Cart {
    /**
     * @param {object} opts
     *   storageKey      {string}   unique localStorage key for this restaurant
     *   serviceChargePct{number}   optional service charge percentage (0–100)
     *   storage         {Storage}  injectable storage (defaults to localStorage)
     */
    constructor(opts) {
      this.storageKey = opts.storageKey || "qr_menu_cart";
      this.serviceChargePct = Number(opts.serviceChargePct) || 0;
      try {
        this.storage = opts.storage ||
          (typeof global.localStorage !== "undefined" ? global.localStorage : memoryStorage());
      } catch (e) {
        this.storage = memoryStorage();
      }
      /** @type {Map<string, number>} itemId -> quantity */
      this.items = new Map();
      this.load();
    }

    /* ----- persistence ----- */

    load() {
      try {
        const raw = this.storage.getItem(this.storageKey);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data && typeof data === "object") {
          Object.entries(data).forEach(([id, qty]) => {
            const q = Math.floor(Number(qty));
            if (id && q > 0) this.items.set(id, q);
          });
        }
      } catch (e) {
        /* Corrupted storage → start with an empty cart. */
        this.items.clear();
      }
    }

    save() {
      try {
        const data = {};
        this.items.forEach((qty, id) => { data[id] = qty; });
        this.storage.setItem(this.storageKey, JSON.stringify(data));
      } catch (e) {
        /* Storage full / unavailable → cart still works for this session. */
      }
    }

    /* ----- mutations ----- */

    /** Add one unit. Returns the new quantity for this item. */
    add(id) {
      const q = (this.items.get(id) || 0) + 1;
      this.items.set(id, q);
      this.save();
      return q;
    }

    /** Set an absolute quantity; qty <= 0 removes the line. */
    setQty(id, qty) {
      const q = Math.floor(Number(qty));
      if (!id || isNaN(q)) return 0;
      if (q <= 0) this.items.delete(id);
      else this.items.set(id, q);
      this.save();
      return q;
    }

    remove(id) {
      this.items.delete(id);
      this.save();
    }

    clear() {
      this.items.clear();
      this.save();
    }

    /* ----- queries ----- */

    qty(id) { return this.items.get(id) || 0; }

    /** Total number of units in the cart. */
    count() {
      let n = 0;
      this.items.forEach((q) => { n += q; });
      return n;
    }

    isEmpty() { return this.items.size === 0; }

    /**
     * Priced cart lines against the current menu.
     * Unknown item ids (menu changed since last visit) are silently dropped.
     * @param {Array} menuItems full menu array
     * @returns {Array<{item:object, qty:number, lineTotal:number|null}>} lineTotal is null when the item has no price yet
     */
    lines(menuItems) {
      const byId = new Map(menuItems.map((m) => [m.id, m]));
      const out = [];
      this.items.forEach((qty, id) => {
        const item = byId.get(id);
        /* A missing/null price means "not priced yet": the line shows no
           amount and contributes nothing to the total. */
        if (item) {
          const priced = item.price !== null && item.price !== undefined && item.price !== "";
          out.push({ item, qty, lineTotal: priced ? Number(item.price) * qty : null });
        }
      });
      return out;
    }

    subtotal(menuItems) {
      return this.lines(menuItems).reduce((sum, l) => sum + (l.lineTotal || 0), 0);
    }

    serviceCharge(menuItems) {
      return this.subtotal(menuItems) * (this.serviceChargePct / 100);
    }

    total(menuItems) {
      return this.subtotal(menuItems) + this.serviceCharge(menuItems);
    }
  }

  global.RestaurantCart = Cart;
  if (typeof module !== "undefined" && module.exports) module.exports = Cart;
})(typeof window !== "undefined" ? window : globalThis);
