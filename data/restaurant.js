/* =============================================================================
   RESTAURANT CONFIGURATION  —  data/restaurant.js
   -----------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT to reuse this template for a new café.
   It contains 100% of the restaurant-specific content:

     • info        → name, logo, tagline, story, contacts, address, images
     • hours       → opening hours (drives the live "Open now" badge)
     • socials     → social media links
     • currency    → how prices are displayed (ETB / Birr by default)
     • theme       → colors & corner radius (applied live to the whole site)
     • ordering    → WhatsApp / call ordering settings
     • ui          → interface language + every label on the page (አማርኛ / English)
     • categories  → menu categories (id, Amharic name, English name, icon)
     • items       → menu items (name, description, price, image, badges…)

   Nothing in index.html / css / js hard-codes restaurant content.
   Language: set ui.defaultLang and ui.switcher below. Each item/category can
   carry a primary `name` (shown big) and a `nameEn` (shown small underneath)
   — for a single-language menu just leave nameEn out.
   ============================================================================= */

const RESTAURANT_DATA = {

  /** Unique id/slug for this restaurant (used for the cart storage key). */
  id: "mesob",

  /* ---------- CAFÉ INFO ---------- */
  info: {
    name: "Mesob",                          // Café name (any language)
    nameAm: "መሶብ",                          // Second name shown under the title
    nameSuffix: "Traditional Ethiopian Café",
    established: 2015,
    tagline: "Authentic Ethiopian food & jebena coffee, shared around one basket.",
    description:                            // meta description (SEO) — keep short
      "Slow-simmered wots, fresh injera and jebena coffee in the heart of Addis Ababa.",
    story:                                  // About section — keep it to 2–3 lines
      "Mesob began in a small family kitchen in Addis Ababa, where our mother's " +
      "doro wot simmered for six hours every Sunday. We still cook with the same " +
      "patience — berbere ground by hand, injera fermented for three days, and " +
      "coffee roasted to order for every ceremony.",
    cuisine: ["Ethiopian", "Traditional", "Coffee Ceremony"],

    phone: "+251 11 553 2847",
    whatsapp: "251911234567",               // International format, no "+" or spaces
    email: "hello@mesob-ethiopia.et",

    address: {
      line1: "Mickey Leland Street, Bole",
      line2: "Addis Ababa, Ethiopia",
      mapsUrl: "https://maps.google.com/?q=Bole,+Addis+Ababa,+Ethiopia",
    },

    logo: "assets/logo.svg",                // Square logo (SVG or PNG)
    heroImage: "assets/img/hero.jpg",       // Wide hero background photo
    aboutImage: "assets/img/about.jpg",     // Photo for the About section
  },

  /* ---------- OPENING HOURS ----------
     days: 0 = Sunday … 6 = Saturday. Times are 24h "HH:MM".
     label / labelAm: how each row is shown in the Visit section. */
  hours: [
    { days: [1, 2, 3, 4, 5], label: "Monday – Friday",   labelAm: "ሰኞ – ዓርብ",     open: "07:00", close: "22:00" },
    { days: [0, 6],          label: "Saturday – Sunday", labelAm: "ቅዳሜ – እሑድ",    open: "08:00", close: "23:00" },
  ],

  /* ---------- SMALL SELLING POINTS (About section) ---------- */
  features: [
    { icon: "🫓", text: "Injera fermented & baked fresh daily" },
    { icon: "🌶️", text: "Berbere & spices ground in-house" },
    { icon: "☕", text: "Traditional jebena coffee ceremony" },
    { icon: "🪑", text: "Family-style mesob platters for sharing" },
  ],

  /* ---------- SOCIAL LINKS ----------
     Supported: instagram, facebook, telegram, tiktok, twitter, youtube, website.
     Remove entries you don't need. */
  socials: [
    { platform: "instagram", url: "https://instagram.com/mesob.et" },
    { platform: "facebook",  url: "https://facebook.com/mesob.et" },
    { platform: "telegram",  url: "https://t.me/mesob_et" },
    { platform: "tiktok",    url: "https://tiktok.com/@mesob.et" },
  ],

  /* ---------- CURRENCY ----------
     position: "before" → "$12"  |  "after" → "420 Br" */
  currency: {
    code: "ETB",
    symbol: "Br",
    position: "after",
    decimals: 0,
  },

  /* ---------- THEME ----------
     Any CSS color works. Applied to the whole site at runtime. */
  theme: {
    accent:      "#b4812f",   // primary gold accent (buttons, prices, links)
    accentDark:  "#8a6119",   // darker accent for hover states
    surface:     "#fffdf8",   // card surfaces
    background:  "#f7f1e6",   // page background
    text:        "#26190f",   // main text
    muted:       "#83705c",   // secondary text
    header:      "#17100a",   // hero / footer dark color
    popular:     "#b4812f",   // "Popular" badge
    vegetarian:  "#3f7d2c",   // "Vegetarian" badge
    spicy:       "#b3341f",   // "Spicy" badge
    radius:      "18px",      // card corner radius
  },

  /* ---------- ORDERING ----------
     whatsappEnabled:  show "Send order via WhatsApp"
     callEnabled:      show "Call the restaurant"
     tableField:       ask for an optional table number / name
     serviceChargePct: optional service charge (0 = none)
     note:             small print under the cart total */
  ordering: {
    whatsappEnabled: true,
    callEnabled: true,
    tableField: true,
    serviceChargePct: 0,
    note: "All prices are in Ethiopian Birr and include VAT.",
  },

  /* ===========================================================================
     INTERFACE LANGUAGE (አማርኛ / English)
     ---------------------------------------------------------------------------
     • defaultLang : which language loads first — "am" or "en"
     • switcher    : false hides the አማርኛ/English switch completely
     • strings     : every button, label and message on the page, per language.
                     To make the menu single-language, set switcher: false and
                     write your language into BOTH key sets (or just the default).
     Token syntax: {name}, {t}, {q}, {n} … are replaced automatically.
     ======================================================================== */
  ui: {
    defaultLang: "am",
    switcher: true,
    strings: {

      en: {
        skipLink: "Skip to the menu",
        navMenu: "Menu", navAbout: "About", navVisit: "Visit us",
        estLine: "Est. {year} · {city}",
        heroCtaMenu: "Browse the menu",
        heroCtaCall: "Call to order",

        searchPlaceholder: "Search the menu — doro wot, tibs, coffee…",
        allCat: "All",
        itemCount: "{n} items",

        popular: "Popular", veg: "Vegetarian", spicy: "Spicy", soldOut: "Sold out",
        add: "Add",
        qtyAria: "Quantity", decAria: "Decrease quantity", incAria: "Increase quantity",
        addAria: "Add {name} to order", removeAria: "Remove {name}",

        viewOrder: "View Order",
        yourOrder: "Your order",
        emptyCartTitle: "Your order is empty",
        emptyCartText: "Pick a few dishes from the menu — everything is made to be shared.",
        browseMenuBtn: "Browse the menu",

        tablePlaceholder: "Table number or name (optional)",
        subtotal: "Subtotal", service: "Service", total: "Total",
        placeOrder: "Place order", clear: "Clear",
        remove: "Remove",

        modalTitle: "Review your order",
        modalSub: "Send it on WhatsApp or call us — the kitchen will confirm right away.",
        whatsappOrder: "Send via WhatsApp",
        callOrder: "Call the restaurant",

        addedToast: "{name} added to your order",
        removedToast: "{name} removed",
        clearedToast: "Order cleared",

        openNow: "Open now · closes {t}",
        opensToday: "Closed · opens {t} today",
        opensTomorrow: "Closed · opens {t} tomorrow",
        opensOn: "Closed · opens {t}",
        statusOpen: "Open", statusClosed: "Closed",
        rightNow: "Right now:",

        aboutEyebrow: "Our story",
        aboutTitle: "The story of {name}",
        aboutBtn: "Find us & opening hours",
        visitEyebrow: "Find us",
        visitTitle: "Location, hours & contact",
        locationTitle: "Location", hoursTitle: "Opening hours", contactTitle: "Contact",
        directions: "Get directions",

        noResultsTitle: "No dishes found",
        noResultsText: "Nothing matches “{q}”. Try a different word — or browse the full menu.",
        clearSearchBtn: "Clear search",

        orderGreeting: "Hello {name}!",
        tableLabel: "Table / name:",
        qrOrderLabel: "New order from the QR menu",
        totalLabel: "Total:",
      },

      am: {
        skipLink: "ወደ ምናሌው ዝለል",
        navMenu: "ምናሌ", navAbout: "ስለ እኛ", navVisit: "አድራሻ",
        estLine: "ከ{year} ጀምሮ · {city}",
        heroCtaMenu: "ምናሌውን ይመልከቱ",
        heroCtaCall: "ለማዘዝ ይደውሉ",

        searchPlaceholder: "ምግብ ይፈልጉ — ዶሮ ወጥ፣ ጥብስ፣ ቡና…",
        allCat: "ሁሉም",
        itemCount: "{n} ዓይነት",

        popular: "ተወዳጅ", veg: "የጾም", spicy: "ቅመም ያለው", soldOut: "አልቋል",
        add: "ጨምር",
        qtyAria: "ብዛት", decAria: "ቀንስ", incAria: "ጨምር",
        addAria: "{name} ወደ ትዕዛዝ ጨምር", removeAria: "{name} አስወግድ",

        viewOrder: "ትዕዛዝ ይመልከቱ",
        yourOrder: "ትዕዛዝዎ",
        emptyCartTitle: "ትዕዛዝዎ ባዶ ነው",
        emptyCartText: "ከምናሌው ምግብ ይምረጡ — ሁሉም ለጋራ ነው።",
        browseMenuBtn: "ምናሌውን ይመልከቱ",

        tablePlaceholder: "የጠረጴዛ ቁጥር ወይም ስም (አማራጭ)",
        subtotal: "ድምር", service: "አገልግሎት", total: "ጠቅላላ",
        placeOrder: "ትዕዛዝ ይላኩ", clear: "አጽዳ",
        remove: "አስወግድ",

        modalTitle: "ትዕዛዝዎን ያረጋግጱ",
        modalSub: "በWhatsApp ይላኩ ወይም ይደውሉ — ምኩራባችን ወዲያውኑ ያረጋግጣል።",
        whatsappOrder: "በWhatsApp ይላኩ",
        callOrder: "ይደውሉልን",

        addedToast: "{name} ታክሏል",
        removedToast: "{name} ተወግዷል",
        clearedToast: "ትዕዛዝ ባዶ ሆኗል",

        openNow: "ክፍት ነው · በ{t} ይዘጋል",
        opensToday: "ተዘግቷል · ዛሬ በ{t} ይከፈታል",
        opensTomorrow: "ተዘግቷል · ነገ በ{t} ይከፈታል",
        opensOn: "ተዘግቷል · በ{t} ይከፈታል",
        statusOpen: "ክፍት", statusClosed: "ዝግ",
        rightNow: "አሁን፦",

        aboutEyebrow: "ታሪካችን",
        aboutTitle: "የ{name} ታሪክ",
        aboutBtn: "አድራሻና የስራ ሰዓት",
        visitEyebrow: "ያግኙን",
        visitTitle: "አድራሻ፣ የስራ ሰዓትና ማግኘት",
        locationTitle: "አድራሻ", hoursTitle: "የስራ ሰዓት", contactTitle: "ማግኘት",
        directions: "አቅጣጫ ይክፈቱ",

        noResultsTitle: "ምግብ አልተገኘም",
        noResultsText: "ከ“{q}” ጋር ምንም አልተገኘም። ሌላ ስም ይሞክሩ ወይም ሙሉ ምናሌውን ይመልከቱ።",
        clearSearchBtn: "ፍለጋውን አጽዳ",

        orderGreeting: "ሰላም {name}!",
        tableLabel: "ጠረጴዛ / ስም:",
        qrOrderLabel: "አዲስ ትዕዛዝ ከQR ምናሌ",
        totalLabel: "ጠቅላላ:",
      },
    },
  },

  /* ---------- MENU CATEGORIES ----------
     id must match the `category` field of the items below.
     name = primary name (shown big) · nameEn = small English under it. */
  categories: [
    { id: "breakfast", name: "ቁርስ",          nameEn: "Breakfast",       icon: "🌄" },
    { id: "starters",  name: "ጀማሪ",          nameEn: "Starters",        icon: "🥟" },
    { id: "wot",       name: "ወጥ",           nameEn: "Stews",           icon: "🍲" },
    { id: "tibs",      name: "ጥብስ & ክትፎ",   nameEn: "Tibs & Kitfo",    icon: "🔥" },
    { id: "fasting",   name: "የጾም",          nameEn: "Fasting",         icon: "🌿" },
    { id: "drinks",    name: "ቡና & መጠጥ",    nameEn: "Coffee & Drinks", icon: "☕" },
  ],

  /* ---------- MENU ITEMS ----------
     id            unique string (used by the cart)
     category      one of the category ids above
     name          primary name — Amharic for this café (shown big)
     nameEn        small English name under it (optional)
     description   SHORT description in the primary language (1 line is enough)
     descriptionEn SHORT description in English (optional)
     price         number, in the currency above
     image         path to a photo (landscape ~800px wide is ideal)
     popular       gold "Popular" badge      → true / false
     veg           green "Vegetarian" badge  → true / false
     spicy         red "Spicy" badge         → true / false
     available     false shows the dish as "Sold out" (cannot be ordered) */
  items: [
    /* --- Breakfast · ቁርስ --- */
    {
      id: "chechebsa", category: "breakfast",
      name: "ጨጨብሳ", nameEn: "Chechebsa",
      description: "ከሞተ በኔተር ቅቤና በበርበሬ",
      descriptionEn: "Torn kita flatbread with spiced butter & berbere",
      price: 220,
      image: "assets/img/breakfast-chechebsa.jpg",
      popular: true, veg: false, spicy: true, available: true,
    },
    {
      id: "firfir", category: "breakfast",
      name: "ስፔሻል ጾም ፍርፍር", nameEn: "Special Fasting Firfir",
      description: "የጾም ፍርፍር በበርበሬ ሶስ",
      descriptionEn: "Injera pieces in a fasting-friendly berbere sauce",
      price: 160,
      image: "assets/img/breakfast-firfir.jpg",
      popular: false, veg: true, spicy: true, available: true,
    },
    {
      id: "ful", category: "breakfast",
      name: "ፉል", nameEn: "Ful Medames",
      description: "ምስር በኔተር ቅቤና በበርበሬ",
      descriptionEn: "Slow-stewed fava beans with spiced butter",
      price: 190,
      image: "assets/img/breakfast-ful.jpg",
      popular: false, veg: true, spicy: false, available: true,
    },

    /* --- Starters · ጀማሪ --- */
    {
      id: "sambusa-beef", category: "starters",
      name: "የስጋ ሳምቡሳ", nameEn: "Beef Sambusa",
      description: "ከቅመም ስጋ የተሞላ · 2 ቁርጥራጮች",
      descriptionEn: "Crispy pastry, seasoned beef · 2 pcs",
      price: 90,
      image: "assets/img/starter-sambusa-beef.jpg",
      popular: false, veg: false, spicy: false, available: true,
    },
    {
      id: "sambusa-lentil", category: "starters",
      name: "የምስር ሳምቡሳ", nameEn: "Lentil Sambusa",
      description: "ከቅመም ምስር የተሞላ · 2 ቁርጥራጮች",
      descriptionEn: "Crispy pastry, spiced lentils · 2 pcs",
      price: 80,
      image: "assets/img/starter-sambusa-lentil.jpg",
      popular: false, veg: true, spicy: false, available: true,
    },
    {
      id: "kategna", category: "starters",
      name: "ካተኛ", nameEn: "Kategna",
      description: "ጠፍፍ ከኔተር ቅቤና ከበርበሬ ጋር",
      descriptionEn: "Toasted injera with spiced butter & berbere",
      price: 140,
      image: "assets/img/starter-kategna.jpg",
      popular: false, veg: true, spicy: true, available: true,
    },

    /* --- Stews · ወጥ --- */
    {
      id: "doro-wot", category: "wot",
      name: "ዶሮ ወጥ", nameEn: "Doro Wot",
      description: "የዶሮ ስጋ በቂይ ወጥ ከእንቁ ጋር",
      descriptionEn: "Chicken in rich berbere stew, with a boiled egg",
      price: 420,
      image: "assets/img/wot-doro.jpg",
      popular: true, veg: false, spicy: true, available: true,
    },
    {
      id: "siga-wot", category: "wot",
      name: "ስጋ ቂይ ወጥ", nameEn: "Beef Key Wot",
      description: "የበሬ ሥጋ በቂይ ወጥ የተቀቀለ",
      descriptionEn: "Tender beef slow-simmered in red berbere stew",
      price: 380,
      image: "assets/img/wot-siga.jpg",
      popular: false, veg: false, spicy: true, available: true,
    },
    {
      id: "bozena-shiro", category: "wot",
      name: "ቦዘና ሽሮ", nameEn: "Bozena Shiro",
      description: "የበሬ ሥጋ ከሽሮ ጋር የተቀላቀለ",
      descriptionEn: "Beef cubes simmered in smooth shiro",
      price: 350,
      image: "assets/img/wot-bozena-shiro.jpg",
      popular: false, veg: false, spicy: true, available: true,
    },

    /* --- Tibs & Kitfo · ጥብስ & ክትፎ --- */
    {
      id: "kitfo", category: "tibs",
      name: "ስፔሻል ክትፎ", nameEn: "Special Kitfo",
      description: "የተፈጨ ሥጋ በሚቤና በኮሰረት",
      descriptionEn: "Hand-minced beef with mitmita & spiced butter",
      price: 680,
      image: "assets/img/wot-kitfo.jpg",
      popular: true, veg: false, spicy: true, available: true,
    },
    {
      id: "derek-tibs", category: "tibs",
      name: "ደረቅ ጥብስ", nameEn: "Derek Tibs",
      description: "የበሬ ሥጋ ጥብስ ከሽንኩርት ጋር",
      descriptionEn: "Sizzling beef sautéed with onions & rosemary",
      price: 590,
      image: "assets/img/tibs-derek.jpg",
      popular: false, veg: false, spicy: false, available: true,
    },
    {
      id: "awaze-tibs", category: "tibs",
      name: "አዋዜ ጥብስ", nameEn: "Awaze Tibs",
      description: "ጥብስ በቅመም አዋዜ ሶስ",
      descriptionEn: "Beef tibs tossed in hot awaze sauce",
      price: 550,
      image: "assets/img/tibs-awaze.jpg",
      popular: false, veg: false, spicy: true, available: true,
    },
    {
      id: "chikina-tibs", category: "tibs",
      name: "ጭክና ጥብስ", nameEn: "Chikina Tibs",
      description: "የተፈጨ ሥጋ ጥብስ በአትክልት",
      descriptionEn: "Shredded beef tibs with peppers & herbs",
      price: 620,
      image: "assets/img/tibs-chikina.jpg",
      popular: true, veg: false, spicy: false, available: true,
    },

    /* --- Fasting · የጾም --- */
    {
      id: "beyaynetu", category: "fasting",
      name: "የጾም በያይነቱ", nameEn: "Fasting Beyaynetu",
      description: "ምስር፣ ሽሮና አትክልት በአንድ ከሰፊድ",
      descriptionEn: "Lentils, shiro & vegetables on one platter",
      price: 340,
      image: "assets/img/fasting-beyaynetu.jpg",
      popular: true, veg: true, spicy: false, available: true,
    },
    {
      id: "misir-wot", category: "fasting",
      name: "ምስር ወጥ", nameEn: "Misir Wot",
      description: "የምስር ወጥ በበርበሬ",
      descriptionEn: "Red lentils simmered in berbere sauce",
      price: 180,
      image: "assets/img/fasting-misir.jpg",
      popular: false, veg: true, spicy: true, available: true,
    },
    {
      id: "shiro-wot", category: "fasting",
      name: "ሽሮ ወጥ", nameEn: "Shiro",
      description: "ምሉጥ የሽሮ ወጥ",
      descriptionEn: "Silky spiced chickpea shiro",
      price: 170,
      image: "assets/img/fasting-shiro.jpg",
      popular: false, veg: true, spicy: false, available: true,
    },

    /* --- Coffee & Drinks · ቡና & መጠጥ --- */
    {
      id: "jebena-buna", category: "drinks",
      name: "ጀበና ቡና", nameEn: "Jebena Buna",
      description: "ባህላዊ የቡና ሥነ ሥርዓት",
      descriptionEn: "Traditional coffee, brewed in a jebena",
      price: 150,
      image: "assets/img/drink-coffee.jpg",
      popular: true, veg: true, spicy: false, available: true,
    },
    {
      id: "spice-tea", category: "drinks",
      name: "ሻይ", nameEn: "Shai · Tea",
      description: "ትኩስ ቅመም ሻይ",
      descriptionEn: "Hot spiced black tea",
      price: 60,
      image: "assets/img/drink-tea.jpg",
      popular: false, veg: true, spicy: false, available: true,
    },
  ],
};

/* Expose globally (loaded before the app scripts). */
window.RESTAURANT_DATA = RESTAURANT_DATA;
