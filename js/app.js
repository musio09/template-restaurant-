/* =============================================================================
   APP ORCHESTRATION — js/app.js
   Wires the data (data/restaurant.js) into the page:
   theme, language (አማርኛ/English), hero, menu rendering, search & category
   filter, cart UI and ordering.

   FUTURE DATABASE CONNECTION
   --------------------------
   Rendering is a pure function of the data object. To serve the menu from a
   backend later, define — before this script —

       window.MENU_DATA_LOADER = () => fetch("/api/menu").then(r => r.json());

   The loader should resolve with { categories, items } (same shape as in
   data/restaurant.js, or the full data object). The menu renders instantly
   from the static file and is refreshed when the loader resolves. You can
   also call QRMenu.setData(newData) at any time.
   ============================================================================= */

(function () {
  "use strict";

  let data = window.RESTAURANT_DATA;
  if (!data) {
    console.error('Restaurant data not found. Is "data/restaurant.js" loaded before "js/app.js"?');
    return;
  }

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = MenuUI.escapeHtml.bind(MenuUI);

  /* ==========================================================================
     LANGUAGE — active UI language + translation helpers
     ========================================================================== */

  let ui = data.ui || {};
  const langKey = `qrmenu_lang_${data.id || "restaurant"}`;

  function initialLang() {
    try {
      const saved = localStorage.getItem(langKey);
      if (saved === "en" || saved === "am") return saved;
    } catch (e) { /* private mode */ }
    return ui.defaultLang || "en";
  }

  let lang = initialLang();

  /** t("openNow", {t:"22:00"}) → localized string with tokens replaced. */
  function t(key, vars) { return MenuUI.T(key, vars); }

  /** Localized label for hours rows: labelAm / labelEn / label. */
  function hoursLabel(rule) {
    if (lang === "am" && rule.labelAm) return rule.labelAm;
    if (lang === "en" && rule.labelEn) return rule.labelEn;
    return rule.label || "";
  }

  /* ---------- other shared helpers ---------- */

  const debounce = (fn, ms) => {
    let tm;
    return (...args) => { clearTimeout(tm); tm = setTimeout(() => fn(...args), ms); };
  };

  /* ==========================================================================
     STATE
     ========================================================================== */

  const cart = new RestaurantCart({
    storageKey: `qrmenu_${data.id || "restaurant"}_v1`,
    serviceChargePct: data.ordering && data.ordering.serviceChargePct,
  });

  const state = { category: "all", query: "" };
  let menuItems = data.items || [];
  let itemById = new Map(menuItems.map((m) => [m.id, m]));

  /* ----- element handles ----- */
  const els = {
    menuRoot: $("#menuRoot"),
    pills: $("#categoryPills"),
    searchInput: $("#searchInput"),
    searchBox: $("#searchBox"),
    toolbar: $("#toolbar"),
    fab: $("#cartFab"),
    overlay: $("#overlay"),
    drawer: $("#cartDrawer"),
    drawerBody: $("#cartBody"),
    drawerFoot: $("#cartFoot"),
    drawerCount: $("#cartCount"),
    modal: $("#orderModal"),
    toast: $("#toast"),
    mobileMenu: $("#mobileMenu"),
    navToggle: $("#navToggle"),
    langSwitch: $("#langSwitch"),
  };

  /* ==========================================================================
     1) THEME — apply data.theme to CSS custom properties
     ========================================================================== */

  function applyTheme() {
    const th = data.theme || {};
    const map = {
      accent: "--accent", accentDark: "--accent-dark", surface: "--surface",
      background: "--bg", text: "--ink", muted: "--muted", header: "--header",
      popular: "--c-popular", vegetarian: "--c-veg", spicy: "--c-spicy", radius: "--radius",
    };
    const root = document.documentElement;
    Object.entries(map).forEach(([key, cssVar]) => {
      if (th[key]) root.style.setProperty(cssVar, th[key]);
    });
  }

  /* ==========================================================================
     2) LANGUAGE SWITCHER + static text
     ========================================================================== */

  function applyI18nStatic() {
    document.documentElement.lang = lang;

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key === "aboutTitle") return; // needs the {name} token, handled below
      el.textContent = t(key);
    });

    const aboutTitle = $("#aboutTitle");
    if (aboutTitle) aboutTitle.textContent = t("aboutTitle", { name: data.info.name });

    els.searchInput.setAttribute("placeholder", t("searchPlaceholder"));
    els.searchInput.setAttribute("aria-label", t("searchPlaceholder"));
    document.title = `${data.info.name} — ${data.info.nameSuffix || data.info.tagline || ""}`.trim();

    if (els.langSwitch && ui.switcher) {
      els.langSwitch.hidden = false;
      $$("button[data-lang]", els.langSwitch).forEach((b) => {
        const active = b.dataset.lang === lang;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
    } else if (els.langSwitch) {
      els.langSwitch.hidden = true;
    }
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem(langKey, lang); } catch (e) { /* private mode */ }
    MenuUI.setLanguage(lang, ui);
    applyI18nStatic();
    hydrateHero();
    hydrateAbout();
    hydrateVisit();
    renderPills();
    renderMenu();
    refreshDrawer();
    refreshFab(false);
  }

  /* ==========================================================================
     3) STATIC CONTENT — hero, about, visit, footer
     ========================================================================== */

  function openingStatus(now) {
    /** Returns {open:boolean|null, key:string, t:string} from data.hours. */
    const hours = Array.isArray(data.hours) ? data.hours : [];
    if (!hours.length) return null;
    const mins = (hm) => { const [h, m] = hm.split(":").map(Number); return h * 60 + m; };
    const day = now.getDay();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    for (const rule of hours) {
      if (!Array.isArray(rule.days) || !rule.days.includes(day)) continue;
      const o = mins(rule.open), c = mins(rule.close);
      const overnight = c <= o;
      const isOpen = overnight ? (nowMin >= o || nowMin < c) : (nowMin >= o && nowMin < c);
      if (isOpen) {
        return { open: true, key: "openNow", t: rule.close };
      }
    }
    /* find the next opening time (today first, then forward up to a week) */
    for (let i = 0; i < 7; i++) {
      const d = (day + i) % 7;
      const r = hours.find((x) => x.days && x.days.includes(d));
      if (!r) continue;
      const o = mins(r.open);
      const closedAlreadyToday = i === 0 && nowMin >= o;
      if (closedAlreadyToday) continue;
      if (i === 0) return { open: false, key: "opensToday", t: r.open };
      if (i === 1) return { open: false, key: "opensTomorrow", t: r.open };
      return { open: false, key: "opensOn", t: r.open };
    }
    return { open: false, key: "opensOn", t: hours[0].open };
  }

  function hydrateHero() {
    const info = data.info;
    const bg = $("#heroBg");
    if (bg && info.heroImage) bg.style.backgroundImage = `url("${info.heroImage}")`;

    $$("[data-restaurant-name]").forEach((n) => { n.textContent = info.name; });

    const am = $("#heroNameAm");
    if (am) {
      const sub = info.nameAm && info.nameAm !== info.name ? info.nameAm : (info.nameSuffix || "");
      am.textContent = sub;
      am.hidden = !sub;
    }

    const tag = $("#heroTagline");
    if (tag) tag.textContent = info.tagline || "";

    const eyebrow = $("#heroEyebrow");
    if (eyebrow) {
      const city = info.address && info.address.line2 ? info.address.line2 : "";
      eyebrow.textContent = info.established
        ? t("estLine", { year: info.established, city })
        : city;
      eyebrow.hidden = !eyebrow.textContent;
    }

    $$("[data-logo]").forEach((img) => { img.src = info.logo; img.alt = `${info.name} logo`; });

    const chips = $("#heroChips");
    if (chips) {
      const st = openingStatus(new Date());
      const statusChip = st
        ? `<span class="chip ${st.open ? "status-open" : "status-closed"}"><span class="dot"></span>${esc(t(st.key, { t: st.t }))}</span>`
        : "";
      chips.innerHTML =
        statusChip +
        (info.cuisine || []).map((c) => `<span class="chip">${esc(c)}</span>`).join("");
    }

    const callBtns = $$("[data-call-link]");
    callBtns.forEach((a) => { a.href = `tel:${(info.phone || "").replace(/\s/g, "")}`; });
    $$("[data-phone-text]").forEach((n) => { n.textContent = info.phone || ""; });
  }

  function hydrateAbout() {
    const info = data.info;
    const img = $("#aboutImage");
    if (img) {
      const src = info.aboutImage || info.heroImage || "";
      if (src) { img.src = src; img.hidden = false; } else { img.hidden = true; }
      img.alt = `Inside ${info.name}`;
    }
    const story = $("#aboutStory");
    if (story) story.textContent = info.story || info.description || "";
    const list = $("#featureList");
    if (list && Array.isArray(data.features)) {
      list.innerHTML = data.features
        .map((f) => `<li><span class="f-ic" aria-hidden="true">${esc(f.icon || "✦")}</span>${esc(f.text)}</li>`)
        .join("");
    }
  }

  function hydrateVisit() {
    const info = data.info;
    const st = openingStatus(new Date());

    const loc = $("#infoLocation");
    if (loc) {
      const maps = info.address && info.address.mapsUrl;
      loc.innerHTML = `
        <p>${esc(info.address.line1)}<br>${esc(info.address.line2)}</p>
        ${maps ? `
        <div class="info-actions">
          <a href="${esc(maps)}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${t("directions")}
          </a>
        </div>` : ""}`;
    }

    const hrs = $("#infoHours");
    if (hrs) {
      const rows = (data.hours || [])
        .map((r) => `<li><strong lang="${lang}">${esc(hoursLabel(r))}</strong><span>${esc(r.open)} – ${esc(r.close)}</span></li>`)
        .join("");
      const statusInline = st
        ? `<p class="now-line">${esc(t("rightNow"))} <span class="status-inline ${st.open ? "open" : "closed"}">${esc(t(st.key, { t: st.t }))}</span></p>`
        : "";
      hrs.innerHTML = rows ? `<ul class="hours-list">${rows}</ul>${statusInline}` : statusInline;
    }

    const con = $("#infoContact");
    if (con) {
      const wa = data.ordering && data.ordering.whatsappEnabled && info.whatsapp
        ? `<a href="https://wa.me/${esc(info.whatsapp)}" target="_blank" rel="noopener">
             <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M9 9.5c0 4 2.5 5.5 5.5 5.5l1-1.5-2-1.5-1 .8c-.8-.4-1.4-1-1.8-1.8l.8-1L10 8z"/></svg>
             WhatsApp</a>`
        : "";
      const emailLine = info.email
        ? `<a href="mailto:${esc(info.email)}" style="text-decoration:none;color:inherit">${esc(info.email)}</a><br>`
        : "";
      con.innerHTML = `
        <p><a href="tel:${esc((info.phone || "").replace(/\s/g, ""))}" style="text-decoration:none;font-weight:700;color:inherit">${esc(info.phone)}</a><br>
        ${emailLine}</p>
        <div class="info-actions">${wa}</div>`;
    }
  }

  function hydrateFooter() {
    const info = data.info;
    const socials = $("#footerSocials");
    if (socials && Array.isArray(data.socials)) {
      socials.innerHTML = data.socials
        .map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.platform)}">${MenuUI.socialIconSvg(s.platform)}</a>`)
        .join("");
    }
    const tag = $("#footerTagline");
    if (tag) tag.textContent = info.tagline || "";
    const year = $("#footerYear");
    if (year) year.textContent = String(new Date().getFullYear());
    const footName = $("#footerName");
    if (footName) footName.textContent = info.name;
  }

  /* ==========================================================================
     4) MENU — category pills, search, rendering
     ========================================================================== */

  function renderPills() {
    const cats = [{ id: "all", name: t("allCat"), nameEn: "", icon: "✨" }, ...(data.categories || [])];
    els.pills.innerHTML = cats
      .map((c) => {
        const sub = MenuUI.subNameFor(c);
        const primaryLang = lang === "en" ? "en" : "am";
        return `
        <button class="pill ${state.category === c.id ? "active" : ""}" role="tab"
          aria-selected="${state.category === c.id}" data-cat="${esc(c.id)}">
          <span aria-hidden="true">${c.icon || ""}</span><span lang="${primaryLang}">${esc(MenuUI.nameFor(c))}</span>
          ${sub ? `<span class="pill-am" lang="${primaryLang === "am" ? "en" : "am"}">${esc(sub)}</span>` : ""}
        </button>`;
      })
      .join("");
  }

  function visibleItems() {
    const q = state.query.trim().toLowerCase();
    return menuItems.filter((item) => {
      const inCat = state.category === "all" || item.category === state.category;
      if (!inCat) return false;
      if (!q) return true;
      const hay = `${item.name} ${item.nameEn || ""} ${item.description || ""} ${item.descriptionEn || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function renderMenu() {
    const items = visibleItems();
    const cats = (data.categories || []).filter((c) => state.category === "all" || c.id === state.category);

    if (!items.length) {
      els.menuRoot.innerHTML = MenuUI.emptySearchHtml(state.query);
      return;
    }

    els.menuRoot.innerHTML = cats
      .map((cat) => {
        const list = items.filter((i) => i.category === cat.id);
        return list.length ? MenuUI.categoryHtml(cat, list, cart, data.currency) : "";
      })
      .join("");
  }

  function setCategory(catId, opts) {
    state.category = catId;
    renderPills();
    renderMenu();
    const active = $(`.pill[data-cat="${CSS.escape(catId)}"]`, els.pills);
    if (active && typeof active.scrollIntoView === "function") {
      active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    try {
      history.replaceState(null, "", catId === "all" ? "#menu" : `#${catId}`);
    } catch (e) { /* older browsers */ }
    if (!opts || !opts.initial) {
      const menuSection = $("#menu");
      if (menuSection && typeof menuSection.scrollIntoView === "function") {
        menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  function initSearch() {
    const apply = debounce(() => {
      state.query = els.searchInput.value;
      els.searchBox.classList.toggle("has-value", !!state.query);
      renderMenu();
    }, 120);
    els.searchInput.addEventListener("input", apply);
  }

  const runSearchReset = () => {
    els.searchInput.value = "";
    state.query = "";
    els.searchBox.classList.remove("has-value");
    renderMenu();
  };

  /* ==========================================================================
     5) CART UI
     ========================================================================== */

  function refreshFab(pulse) {
    const count = cart.count();
    els.fab.classList.toggle("show", count > 0);
    $("#fabCount").textContent = String(count);
    $("#fabTotal").textContent = MenuUI.formatPrice(cart.total(menuItems), data.currency);
    if (pulse && count > 0) {
      els.fab.classList.remove("pulse");
      void els.fab.offsetWidth;
      els.fab.classList.add("pulse");
    }
  }

  function refreshTotals() {
    const sub = cart.subtotal(menuItems);
    const pct = (data.ordering && data.ordering.serviceChargePct) || 0;
    const svc = cart.serviceCharge(menuItems);
    const total = cart.total(menuItems);
    const money = (n) => MenuUI.formatPrice(n, data.currency);

    const svcRow = pct > 0
      ? `<div class="t-row"><span>${esc(t("service"))} (${pct}%)</span><span>${esc(money(svc))}</span></div>`
      : "";
    const tableField = (data.ordering && data.ordering.tableField)
      ? `<label class="table-input">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16M6 20V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12M9 6V4h6v2"/></svg>
           <input id="tableInput" type="text" inputmode="text" maxlength="30" placeholder="${esc(t("tablePlaceholder"))}" aria-label="${esc(t("tablePlaceholder"))}">
         </label>`
      : "";

    els.drawerFoot.innerHTML = `
      ${tableField}
      <div class="totals">
        <div class="t-row"><span>${esc(t("subtotal"))}</span><span>${esc(money(sub))}</span></div>
        ${svcRow}
        <div class="t-row grand"><span>${esc(t("total"))}</span><span class="t-val">${esc(money(total))}</span></div>
      </div>
      ${(data.ordering && data.ordering.note) ? `<p class="cart-note">${esc(data.ordering.note)}</p>` : ""}
      <div class="drawer-actions">
        <button class="btn btn-danger" data-action="clear-cart">${esc(t("clear"))}</button>
        <button class="btn btn-gold" data-action="checkout">${esc(t("placeOrder"))}</button>
      </div>`;
  }

  function refreshDrawer() {
    const lines = cart.lines(menuItems);
    els.drawerCount.textContent = String(cart.count());

    if (!lines.length) {
      els.drawerBody.innerHTML = MenuUI.emptyCartHtml();
      els.drawerFoot.innerHTML = "";
      return;
    }
    els.drawerBody.innerHTML = lines.map((l) => MenuUI.cartLineHtml(l, data.currency)).join("");
    refreshTotals();
  }

  /** Surgical per-item updates so +/− never loses the user's place. */
  function refreshCardAction(id) {
    const card = $(`[data-card="${CSS.escape(id)}"]`);
    if (!card) return;
    const foot = $(".card-foot", card);
    if (!foot) return;
    const item = itemById.get(id);
    const qty = cart.qty(id);
    let slot = $(".action-slot", foot);
    if (!slot) {
      slot = document.createElement("div");
      slot.className = "action-slot";
      foot.appendChild(slot);
    }
    /* Sold-out items never get an Add button, even after cart refreshes —
       but if one is still in the cart, keep the stepper so it can be removed. */
    slot.innerHTML = qty > 0
      ? MenuUI.stepperHtml(id, qty)
      : (item && item.available === false ? "" : MenuUI.addBtnHtml(item));
  }

  function afterCartChange(changedId, opts) {
    if (changedId) refreshCardAction(changedId);
    else itemById.forEach((_, id) => refreshCardAction(id)); /* clear-all / restore */
    refreshDrawer();
    refreshFab(opts && opts.pulse);
  }

  let toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  /* ----- drawer open/close ----- */

  let lastFocus = null;

  function openCart() {
    refreshDrawer();
    els.drawer.classList.add("open");
    els.overlay.classList.add("show");
    document.body.classList.add("no-scroll");
    els.drawer.setAttribute("aria-hidden", "false");
    lastFocus = document.activeElement;
    const closeBtn = $("#closeCart");
    if (closeBtn) closeBtn.focus();
  }

  function closeCart() {
    els.drawer.classList.remove("open");
    if (!els.modal.classList.contains("open")) {
      els.overlay.classList.remove("show");
      document.body.classList.remove("no-scroll");
    }
    els.drawer.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ----- order modal ----- */

  function orderMessageText(lines, total) {
    const table = ($("#tableInput") && $("#tableInput").value.trim()) || "";
    const rows = lines.map((l) => `• ${l.qty}× ${MenuUI.nameFor(l.item)} — ${MenuUI.formatPrice(l.lineTotal, data.currency)}`);
    return [
      t("orderGreeting", { name: data.info.name }),
      table ? `${t("tableLabel")} ${table}` : t("qrOrderLabel"),
      "",
      ...rows,
      "",
      `${t("totalLabel")} ${MenuUI.formatPrice(total, data.currency)}`,
    ].join("\n");
  }

  function buildSummaryHtml(lines, total) {
    const money = (n) => MenuUI.formatPrice(n, data.currency);
    return lines.map((l) => `
      <div class="os-line"><span>${l.qty}× ${esc(MenuUI.nameFor(l.item))}</span><span>${esc(money(l.lineTotal))}</span></div>`).join("") +
      `<div class="os-line os-total"><span>${esc(t("total"))}</span><span>${esc(money(total))}</span></div>`;
  }

  function openOrderModal() {
    const lines = cart.lines(menuItems);
    if (!lines.length) return;
    const total = cart.total(menuItems);
    const info = data.info;
    const msg = orderMessageText(lines, total);

    $("#orderSummary").innerHTML = buildSummaryHtml(lines, total);

    const wa = $("#waOrder");
    if (wa && data.ordering.whatsappEnabled && info.whatsapp) {
      wa.href = `https://wa.me/${info.whatsapp}?text=${encodeURIComponent(msg)}`;
      wa.style.display = "";
    } else if (wa) wa.style.display = "none";

    const call = $("#callOrder");
    if (call && data.ordering.callEnabled && info.phone) {
      call.href = `tel:${info.phone.replace(/\s/g, "")}`;
      call.style.display = "";
    } else if (call) call.style.display = "none";

    els.modal.classList.add("open");
    document.body.classList.add("no-scroll");
    els.modal.setAttribute("aria-hidden", "false");
    const close = $("#closeModal");
    if (close) close.focus();
  }

  function closeOrderModal() {
    els.modal.classList.remove("open");
    els.modal.setAttribute("aria-hidden", "true");
    /* The drawer usually stays open under the modal; restore page state only
       if it isn't. */
    if (!els.drawer.classList.contains("open")) {
      document.body.classList.remove("no-scroll");
      els.overlay.classList.remove("show");
    }
  }

  /* ==========================================================================
     6) GLOBAL EVENT DELEGATION
     ========================================================================== */

  function onAction(btn) {
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const item = id && itemById.get(id);

    switch (action) {
      case "add":
        cart.add(id);
        afterCartChange(id, { pulse: true });
        toast(t("addedToast", { name: item ? MenuUI.nameFor(item) : "" }));
        break;
      case "inc":
        cart.add(id);
        afterCartChange(id, { pulse: true });
        break;
      case "dec": {
        const q = cart.setQty(id, cart.qty(id) - 1);
        afterCartChange(id, {});
        if (q === 0 && item) toast(t("removedToast", { name: MenuUI.nameFor(item) }));
        break;
      }
      case "remove":
        cart.remove(id);
        afterCartChange(id, {});
        if (item) toast(t("removedToast", { name: MenuUI.nameFor(item) }));
        break;
      case "clear-cart":
        cart.clear();
        afterCartChange(null, {});
        toast(t("clearedToast"));
        break;
      case "open-cart":
        openCart();
        break;
      case "close-cart":
        closeCart();
        break;
      case "checkout":
        openOrderModal();
        break;
      case "close-modal":
        closeOrderModal();
        break;
      case "reset-search":
        runSearchReset();
        break;
      default:
        break;
    }
  }

  function closeMobileMenu() {
    if (!els.mobileMenu) return;
    els.mobileMenu.classList.remove("open");
    if (els.navToggle) els.navToggle.setAttribute("aria-expanded", "false");
  }

  function bindEvents() {
    document.addEventListener("click", (e) => {
      const actionBtn = e.target.closest("[data-action]");
      if (actionBtn) {
        onAction(actionBtn);
        return;
      }
      const pill = e.target.closest(".pill[data-cat]");
      if (pill) {
        setCategory(pill.dataset.cat, {});
        return;
      }
      const langBtn = e.target.closest("#langSwitch button[data-lang]");
      if (langBtn) {
        setLang(langBtn.dataset.lang);
        return;
      }
      if (e.target.closest("#clearSearch")) runSearchReset();
    });

    els.fab.addEventListener("click", openCart);
    els.overlay.addEventListener("click", () => { closeOrderModal(); closeCart(); });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (els.modal.classList.contains("open")) closeOrderModal();
        else if (els.drawer.classList.contains("open")) closeCart();
        closeMobileMenu();
      }
    });

    /* Search: Enter scrolls to results instead of submitting anything. */
    els.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const menu = $("#menu");
        if (menu && typeof menu.scrollIntoView === "function") menu.scrollIntoView({ behavior: "smooth" });
      }
    });

    /* Broken images → graceful pattern placeholder (great for template reuse). */
    document.addEventListener("error", (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      const media = img.closest(".card-media");
      const line = img.closest(".cart-line");
      if (media) media.classList.add("noimg");
      if (line) line.classList.add("noimg");
      img.remove();
    }, true);

    /* Mobile menu */
    if (els.navToggle) {
      els.navToggle.addEventListener("click", () => {
        const open = els.mobileMenu.classList.toggle("open");
        els.navToggle.setAttribute("aria-expanded", String(open));
      });
      els.mobileMenu.addEventListener("click", (e) => {
        if (e.target.closest("a")) closeMobileMenu();
      });
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".mobile-menu") && !e.target.closest(".nav-toggle")) closeMobileMenu();
      });
    }

    /* Sticky toolbar shadow */
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    els.toolbar.before(sentinel);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        els.toolbar.classList.toggle("is-stuck", !entry.isIntersecting);
      }).observe(sentinel);
    } else {
      els.toolbar.classList.add("is-stuck");
    }
  }

  /* ----- reveal on scroll (about / visit only — the menu renders instantly) --- */

  let revealObserver;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    }
    $$(".reveal:not(.in)").forEach((el) => revealObserver.observe(el));
  }

  /* ==========================================================================
     7) PUBLIC API — future database / integrations
     ========================================================================== */

  function setData(newData) {
    if (!newData || !Array.isArray(newData.items)) return;
    data = Object.assign({}, data, newData);
    ui = data.ui || ui;
    menuItems = data.items || [];
    itemById = new Map(menuItems.map((m) => [m.id, m]));
    applyTheme();
    applyI18nStatic();
    hydrateHero();
    hydrateAbout();
    hydrateVisit();
    hydrateFooter();
    renderPills();
    renderMenu();
    afterCartChange(null, {});
  }

  window.QRMenu = {
    get data() { return data; },
    cart,
    setCategory,
    setLang,
    refresh: () => { renderPills(); renderMenu(); afterCartChange(null, {}); },
    setData,
  };

  /* ==========================================================================
     8) INIT
     ========================================================================== */

  function init() {
    MenuUI.setLanguage(lang, ui);
    applyTheme();
    applyI18nStatic();
    hydrateHero();
    hydrateAbout();
    hydrateVisit();
    hydrateFooter();
    renderPills();
    bindEvents();
    initSearch();

    /* Deep link: open on a category, e.g. menu.html#wot */
    const initial = location.hash.replace("#", "");
    if (initial && (data.categories || []).some((c) => c.id === initial)) {
      state.category = initial;
      renderPills();
    }

    /* Render the menu immediately — no artificial loading delay. */
    renderMenu();
    afterCartChange(null, {});
    refreshFab(false);
    observeReveals();

    /* Optional remote menu hook (future database connection). */
    if (typeof window.MENU_DATA_LOADER === "function") {
      Promise.resolve()
        .then(() => window.MENU_DATA_LOADER())
        .then((remote) => { if (remote) setData(remote); })
        .catch((err) => console.warn("Menu data loader failed — using bundled data.", err));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
