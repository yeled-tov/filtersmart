/**
 * Single source of truth for the business details that appear across the site,
 * the SEO metadata and the structured data. Supabase `site_settings` can
 * override the contact fields at runtime; these are the defaults.
 */
export const SITE = {
  url: "https://www.filterphone.com",
  name: "FilterPhone – פילטר פון",
  shortName: "FilterPhone",
  tagline: "חכם. מסונן. בטוח.",
  phone: "052-718-6881",
  phoneRaw: "0527186881",
  phoneIntl: "+972-52-718-6881",
  email: "ywldyld@gmail.com",
  street: "חטיבת גבעתי 2, כניסה ו׳",
  neighbourhood: "רובע ג׳, אשדוד",
  city: "אשדוד",
  hours: "א׳–ה׳ 09:00–19:00 · ו׳ 09:00–13:00",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=%D7%97%D7%98%D7%99%D7%91%D7%AA+%D7%92%D7%91%D7%A2%D7%AA%D7%99+2+%D7%90%D7%A9%D7%93%D7%95%D7%93",
  whatsapp: "https://wa.me/972527186881",
  bit: "https://bitpay.co.il/app/me/0527186881",
  // Served from the app's hosting mirror, not from GitHub: the app repository is
  // going private, which takes its public release assets down with it.
  filterTubeApk: "https://filter-tube-52d8e.web.app/download/FilterTube.apk",
} as const;

/** Builds a WhatsApp deep link with a pre-filled Hebrew message. */
export const waLink = (message: string, base: string = SITE.whatsapp) =>
  `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(message)}`;

export const WA_DEFAULT = waLink("שלום פילטר פון, אשמח לקבל פרטים על סינון");
