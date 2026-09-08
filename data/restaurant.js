/* =============================================================================
   RESTAURANT CONFIGURATION  —  data/restaurant.js
   -----------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT to reuse this template for a new
   restaurant. It contains 100% of the restaurant-specific content:

     • info        → name, logo, tagline, description, story, contacts, address
     • hours       → opening hours (also used for the "Open now" badge)
     • socials     → social media links
     • currency    → how prices are displayed
     • theme       → colors & border radius (applied live to the whole site)
     • ordering    → WhatsApp / call ordering settings
     • categories  → menu categories (id, name, Amharic name, icon)
     • items       → menu items (name, description, price, image, badges…)

   Nothing in index.html / css / js hard-codes restaurant content.
   ============================================================================= */

const RESTAURANT_DATA = {

  /** Unique id/slug for this restaurant (used for the cart storage key). */
  id: "mesob",

  /** ---------- RESTAURANT INFO ---------- */
  info: {
    name: "Mesob",                          // Restaurant name
    nameAm: "መሶብ",                          // Name in Amharic (optional)
    nameSuffix: "Traditional Ethiopian Restaurant",
    established: 2015,                      // Year opened
    tagline: "Authentic Ethiopian cuisine, gathered around one basket.",
    description:
      "Slow-simmered wots, hand-rolled injera and jebena coffee, served the " +
      "way it has been shared for generations — on a woven mesob, in good company.",
    story:
      "Mesob began in a small family kitchen in Addis Ababa, where our mother's " +
      "doro wot simmered for six hours every Sunday. Today we cook with the same " +
      "patience: berbere ground by hand, injera fermented for three days, and " +
      "coffee roasted to order for every ceremony. The mesob basket at the heart " +
      "of every table is our promise — here, food is always shared.",
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

  /** Small selling points shown in the About section. */
  features: [
    { icon: "🫓", text: "Injera fermented & baked fresh daily" },
    { icon: "🌶️", text: "Berbere & spices ground in-house" },
    { icon: "☕", text: "Traditional jebena coffee ceremony" },
    { icon: "🪑", text: "Family-style mesob platters for sharing" },
  ],

 

  /** ---------- SOCIAL LINKS ----------
      Supported platforms: instagram, facebook, telegram, tiktok, twitter,
      youtube, website. Remove entries you don't need. */
  socials: [
    { platform: "instagram", url: "https://instagram.com/mesob.et" },
    { platform: "facebook",  url: "https://facebook.com/mesob.et" },
    { platform: "telegram",  url: "https://t.me/mesob_et" },
    { platform: "tiktok",    url: "https://tiktok.com/@mesob.et" },
  ],

  /** ---------- CURRENCY ----------
      position: "before" → "$12.00"   |   "after" → "420 Br" */
  currency: {
    code: "ETB",
    symbol: "Br",
    position: "after",
    decimals: 0,
  },

  /** ---------- THEME ----------
      Any CSS color works. These are applied to the whole site at runtime. */
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

  /** ---------- ORDERING ----------
      whatsappEnabled: show "Send order via WhatsApp" button
      callEnabled:       show "Call the restaurant" button
      tableField:        ask for an optional table number / name in the cart
      serviceChargePct:  optional service charge (0 = none)
      note:              small print under the cart total */
  ordering: {
    whatsappEnabled: true,
    callEnabled: true,
    tableField: true,
    serviceChargePct: 0,
    note: "All prices are in Ethiopian Birr and include VAT.",
  },

  /** ---------- MENU CATEGORIES ----------
      id must match the `category` field of the items below.
      icon: any emoji (or short text). am: Amharic name (optional). */
  categories: [
    { id: "breakfast", name: "ቁርስ",     am: "breakfast",  icon: "🌄" },
    { id: "starters",  name: "Starters",      am: "ጀማሪ",  icon: "🥟" },
    { id: "wot",       name: "ወጥ",   am: "spices",   icon: "🍲" },
    { id: "tibs",      name: "ጥብስ & ክትፎ",  icon: "🔥" },
    { id: "fasting",   name: "የጾም", am: "Fasting and vegs",  icon: "🌿" },
    { id: "drinks",    name: "Coffee & Drinks", am: "መጠጥ", icon: "☕" },
  ],

  /** ---------- MENU ITEMS ----------
      id:         unique string
      category:   one of the category ids above
      name / am:  dish name (Amharic optional)
      description: one or two short sentences
      price:      number, in the currency above
      image:      path to a photo (square-ish images look best)
      popular:    gold "Popular" badge        → true / false
      veg:        green "Vegetarian" badge    → true / false
      spicy:      red "Spicy" badge           → true / false
      available:  false shows the dish as "Sold out" (cannot be ordered) */
  items: [
    /* --- Breakfast (ቁርስ) --- */
    {
      id: "chechebsa",
      category: "breakfast",
        name: "ጨጨብሳ",
      price: 220,
      image: "assets/img/breakfast-chechebsa.jpg",
      popular: true, veg: false, spicy: true, available: true,
    },
    {
      id: "fasting-firfir",
      category: "breakfast",
      name: " ስፔሻል ጾም ፍርፍር[SpecialFirfir]", 
   
      price: 160,
      image: "assets/img/breakfast-firfir.jpg",
      popular: false, veg: true, spicy: true, available: true,
    },
    {
      id: "ful",
      category: "breakfast",
         am: "ፉል",
      name: "Ful ",
        price: 190,
      image: "assets/img/breakfast-ful.jpg",
      popular: false, veg: true, spicy: false, available: true,
    },

    /* --- Starters (ጀማሪ) --- */
    {
      id: "sambusa-beef",
      category: "starters",
      name: "የስጋ ሳምቡሳ",
      description:
        "2 ፍሪ. (2 pcs)",
      price: 90,
      image: "assets/img/starter-sambusa-beef.jpg",
      popular: false, veg: false, spicy: false, available: true,
    },
    {
      id: "sambusa-lentil",
      category: "starters",
         name: "የምስር ሳምቡሳ",
      description:
        "2ፍሪ. (2 pcs)",
      price: 80,
      image: "assets/img/starter-sambusa-lentil.jpg",
      popular: false, veg: true, spicy: false, available: true,
    },
    {
      id: "kategna",
      category: "starters",
      name: "ካተኛ",
     price: 140,
      image: "assets/img/starter-kategna.jpg",
      popular: false, veg: false, spicy: true, available: true,
    },

    /* --- Wot · Stews (ወጥ) --- */
    {
      id: "doro-wot",
      category: "wot",
      name: "ዶሮ ወጥ",

     price: 420,
      image: "assets/img/wot-doro.jpg",
      popular: true, veg: false, spicy: true, available: true,
    },
    {
      id: "siga-wot",
      category: "wot",
      name: "ስጋ ቂይ ወጥ",
  
      description:
        "Tender beef slow-cooked in a deep red berbere stew with onions and spiced butter, until the sauce turns silky.",
      price: 380,
      image: "assets/img/wot-siga.jpg",
      popular: false, veg: false, spicy: true, available: true,
    },
    {
      id: "bozena-shiro",
      category: "wot",
      name: "ቦዘና ሽሮ",
    
      price: 350,
      image: "assets/img/wot-bozena-shiro.jpg",
      popular: false, veg: false, spicy: true, available: true,
    },

    /* --- Tibs & Sauté (ጥብስ) --- */
      {
      id: "kitfo",
      category: "tibs",
      name: "ስፔሻል ክትፎ",
     
        price: 680,
      image: "assets/img/wot-kitfo.jpg",
      popular: true, veg: false, spicy: true, available: true,
    },
     {
      id: "derek-tibs",
      category: "tibs",
      name: "ደረቅ ጥብስ",
 price: 590,
      image: "assets/img/tibs-derek.jpg",
      popular: false, veg: false, spicy: false, available: true,
    },
    {
      id: "awaze-tibs",
      category: "tibs",
      name:"አዋዜ ጥብስ",
      price: 550,
      image: "assets/img/tibs-awaze.jpg",
      popular: false, veg: false, spicy: true, available: true,
    },
    {
      id: "chikina-tibs",
      category: "tibs",
      name: "ጭክና ጥብስ",
      price: 620,
      image: "assets/img/tibs-chikina.jpg",
      popular: true, veg: false, spicy: false, available: true,
    },

    /* --- Fasting & Vegetarian (የጾም) --- */
    {
      id: "beyaynetu",
      category: "fasting",
      name: "የጾም በያይነቱ",
   
     price: 340,
      image: "assets/img/fasting-beyaynetu.jpg",
      popular: true, veg: true, spicy: false, available: true,
    },
    {
      id: "misir-wot",
      category: "fasting",
      name: "ምስር",
price: 180,
      image: "assets/img/fasting-misir.jpg",
      popular: false, veg: true, spicy: true, available: true,
    },
    {
      id: "shiro-wot",
      category: "fasting",
      name: "ሽሮ ወጥ",
      price: 170,
      image: "assets/img/fasting-shiro.jpg",
      popular: false, veg: true, spicy: false, available: true,
    },

    /* --- Coffee & Drinks (መጠጥ) --- */
    {
      id: "jebena-buna",
      category: "drinks",
      name: "ጀበና ቡና",
     
price: 150,
      image: "assets/img/drink-coffee.jpg",
      popular: true, veg: true, spicy: false, available: true,
    },
    {
      id: "spice-tea",
      category: "drinks",
      name: " ሻይ",
       price: 60,
      image: "assets/img/drink-tea.jpg",
      popular: false, veg: true, spicy: false, available: true,
    },
  ],
};

/* Expose globally (loaded before the app scripts). */
window.RESTAURANT_DATA = RESTAURANT_DATA;
