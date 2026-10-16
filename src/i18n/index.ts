// Minimal i18n helpers.
// French is the default language and lives at the root ("/initiation").
// English pages live under "/en" with the same slugs ("/en/initiation").

export const languages = { fr: "Français", en: "English" } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = "fr";

/** Language of the current page, deduced from its URL. */
export function getLang(url: URL): Lang {
  const p = url.pathname;
  return p === "/en" || p.startsWith("/en/") ? "en" : "fr";
}

/** Path without the language prefix ("/en/contact" → "/contact"). */
export function stripLang(pathname: string): string {
  if (pathname === "/en" || pathname === "/en/") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
}

/** Path of a page in the given language ("/contact", "en" → "/en/contact"). */
export function localizePath(path: string, lang: Lang): string {
  if (lang === "fr") return path;
  return path === "/" ? "/en/" : `/en${path}`;
}

const ui = {
  fr: {
    "site.tagline": "Teintures végétales · Haute-Provence",
    "site.home": "Accueil",
    "nav.atelier": "L'atelier",
    "nav.stages": "Stages",
    "nav.calendar": "Calendrier",
    "nav.stay": "Séjournez",
    "nav.gallery": "Galerie",
    "nav.shop": "Boutique",
    "nav.contact": "Contact",
    "nav.book": "Réserver un stage",
    "nav.main": "Navigation principale",
    "nav.mobile": "Navigation mobile",
    "nav.openMenu": "Ouvrir le menu",
    "nav.homeAria": "Atelier Ilys — Accueil",
    "lang.switch": "Read this page in English",

    "footer.about1": "Teintures végétales artisanales en Haute-Provence.",
    "footer.about2": "Stages, hébergement et services personnalisés",
    "footer.about3": "au cœur d'une magnanerie du XVIII<sup>e</sup> siècle.",
    "footer.navigation": "Navigation",
    "footer.workshops": "Stages de teinture",
    "footer.calendar": "Calendrier 2026",
    "footer.bookWorkshop": "Réserver un stage",
    "footer.lodging": "Hébergement",
    "footer.bookStay": "Réserver un séjour",
    "footer.gallery": "Galerie photos",
    "footer.custom": "Service personnalisé",
    "footer.gift": "Offrir un cadeau",
    "footer.write": "Nous écrire",
    "footer.rights": "Tous droits réservés",
    "footer.legal": "Mentions légales",

    "form.name": "Nom et prénom",
    "form.email": "Email",
    "form.phone": "Téléphone",
    "form.namePlaceholder": "Marie Dupont",
    "form.emailPlaceholder": "marie@exemple.fr",
    "form.phonePlaceholder": "06 12 34 56 78",
    "form.sending": "Envoi en cours…",
    "form.sendRequest": "Envoyer ma demande",
    "form.error":
      "Une erreur est survenue. Merci de réessayer ou de nous contacter par email.",

    "booking.type": "Type de stage",
    "booking.typeChoose": "Choisissez un type de stage…",
    "booking.duration": "Durée souhaitée",
    "booking.durationChoose": "Choisissez une durée…",
    "booking.date": "Date(s) souhaitée(s)",
    "booking.datePlaceholder": "ex: juillet 2026, ou une date précise",
    "booking.dateHintBefore": "Consultez le",
    "booking.dateHintLink": "calendrier des stages",
    "booking.dateHintAfter": "pour les dates disponibles.",
    "booking.participants": "Nombre de participants",
    "booking.wishes": "Vos souhaits ou questions",
    "booking.wishesPlaceholder":
      "Précisions sur votre projet, niveau, fibres à teindre, besoins particuliers…",
    "booking.note": "Nous vous confirmons la disponibilité par email sous 48h.",
    "booking.success":
      "Votre demande a bien été reçue ! Nous vous répondons dans les 48h pour confirmer les disponibilités.",

    "stay.room": "Hébergement souhaité",
    "stay.roomChoose": "Choisissez un hébergement…",
    "stay.arrival": "Date d'arrivée",
    "stay.departure": "Date de départ",
    "stay.guests": "Nombre de personnes",
    "stay.message": "Message ou demandes particulières",
    "stay.messagePlaceholder":
      "Animaux, besoins spécifiques, combinaison stage + hébergement…",
    "stay.note": "Nous vous répondons dans les 48h pour confirmer la disponibilité.",
    "stay.success":
      "Votre demande de séjour a bien été reçue ! Nous vous répondons dans les 48h.",

    "contact.message": "Message",
    "contact.messagePlaceholder": "Votre message…",
    "contact.send": "Envoyer le message",
    "contact.success": "Votre message a bien été envoyé. Nous vous répondrons sous 48h.",

    "workshop.more": "En savoir plus",
    "workshop.book": "Réserver ce stage",
    "accommodation.capacity": "Capacité : ",
    "accommodation.night": "/nuit",
    "accommodation.book": "Réserver ce séjour",

    "map.title": "Où se trouve Atelier Ilys ?",
    "carousel.prev": "Image précédente",
    "carousel.next": "Image suivante",
    "gallery.view": "Voir : ",
    "gallery.viewer": "Visionneuse de photos",
    "gallery.close": "Fermer",
    "sumup.newTab": "(ouvre SumUp dans un nouvel onglet)",
  },
  en: {
    "site.tagline": "Natural plant dyes · Haute-Provence",
    "site.home": "Home",
    "nav.atelier": "The studio",
    "nav.stages": "Workshops",
    "nav.calendar": "Calendar",
    "nav.stay": "Stay",
    "nav.gallery": "Gallery",
    "nav.shop": "Shop",
    "nav.contact": "Contact",
    "nav.book": "Book a workshop",
    "nav.main": "Main navigation",
    "nav.mobile": "Mobile navigation",
    "nav.openMenu": "Open menu",
    "nav.homeAria": "Atelier Ilys — Home",
    "lang.switch": "Lire cette page en français",

    "footer.about1": "Handcrafted natural plant dyeing in Haute-Provence.",
    "footer.about2": "Workshops, accommodation and bespoke services",
    "footer.about3": "in an 18<sup>th</sup>-century silk farm.",
    "footer.navigation": "Navigation",
    "footer.workshops": "Dyeing workshops",
    "footer.calendar": "2026 calendar",
    "footer.bookWorkshop": "Book a workshop",
    "footer.lodging": "Accommodation",
    "footer.bookStay": "Book a stay",
    "footer.gallery": "Photo gallery",
    "footer.custom": "Bespoke service",
    "footer.gift": "Give a gift",
    "footer.write": "Write to us",
    "footer.rights": "All rights reserved",
    "footer.legal": "Legal notice",

    "form.name": "Full name",
    "form.email": "Email",
    "form.phone": "Phone",
    "form.namePlaceholder": "Jane Smith",
    "form.emailPlaceholder": "jane@example.com",
    "form.phonePlaceholder": "+44 7700 900123",
    "form.sending": "Sending…",
    "form.sendRequest": "Send my request",
    "form.error":
      "Something went wrong. Please try again or contact us directly by email.",

    "booking.type": "Workshop type",
    "booking.typeChoose": "Choose a workshop type…",
    "booking.duration": "Preferred duration",
    "booking.durationChoose": "Choose a duration…",
    "booking.date": "Preferred date(s)",
    "booking.datePlaceholder": "e.g. July 2026, or a specific date",
    "booking.dateHintBefore": "Check the",
    "booking.dateHintLink": "workshop calendar",
    "booking.dateHintAfter": "for available dates.",
    "booking.participants": "Number of participants",
    "booking.wishes": "Your wishes or questions",
    "booking.wishesPlaceholder":
      "Details about your project, level, fibres to dye, special needs…",
    "booking.note": "We will confirm availability by email within 48 hours.",
    "booking.success":
      "Your request has been received! We will reply within 48 hours to confirm availability.",

    "stay.room": "Preferred accommodation",
    "stay.roomChoose": "Choose an accommodation…",
    "stay.arrival": "Arrival date",
    "stay.departure": "Departure date",
    "stay.guests": "Number of guests",
    "stay.message": "Message or special requests",
    "stay.messagePlaceholder":
      "Pets, specific needs, combining a workshop and a stay…",
    "stay.note": "We will reply within 48 hours to confirm availability.",
    "stay.success":
      "Your stay request has been received! We will reply within 48 hours.",

    "contact.message": "Message",
    "contact.messagePlaceholder": "Your message…",
    "contact.send": "Send message",
    "contact.success": "Your message has been sent. We will reply within 48 hours.",

    "workshop.more": "Learn more",
    "workshop.book": "Book this workshop",
    "accommodation.capacity": "Capacity: ",
    "accommodation.night": "/night",
    "accommodation.book": "Book this stay",

    "map.title": "Where is Atelier Ilys?",
    "carousel.prev": "Previous image",
    "carousel.next": "Next image",
    "gallery.view": "View: ",
    "gallery.viewer": "Photo viewer",
    "gallery.close": "Close",
    "sumup.newTab": "(opens SumUp in a new tab)",
  },
} as const;

export type UiKey = keyof (typeof ui)["fr"];

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
}
