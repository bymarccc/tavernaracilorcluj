/* ============================================================
   DE COMPLETAT: valorile de mai jos vin de la managerul restaurantului.
   Lasă "" unde nu știi încă; pe site apare un spațiu marcat cu linie punctată.
   ============================================================ */
const SITE = {
  prices: {            // lei, doar cifre, ex: 189
    clasic: "", platou: "", boil: "",
    soft: "", vinbere: "", complet: ""
  },
  minGuests: "",       // număr minim de participanți
  groupCap: "",        // capacitatea zonei pentru grupuri
  minVouchers: "",     // comandă minimă vouchere
  menuUrl: "https://tavernaracilor.ro/meniu-qr/",   // pagina cu meniul complet
  contactName: "",
  links: {             // unde duce „Explorează” la fiecare tip de eveniment
    corporate: "corporate.html",
    private: "private.html", weddings: "nunti.html"
  },
  social: {            // linkurile rețelelor sociale
    linkedin: "", facebook: "", tiktok: "https://www.tiktok.com/@tavernaracilor.cluj",
    instagram: "https://www.instagram.com/tavernaracilor.cluj"
  },
  phone: "",           // ex: "+40 7xx xxx xxx"
  email: "contact@tavernaracilorcluj.ro",
  formEndpoint: ""     // opțional: URL de formular (Formspree etc.). Gol = se deschide e-mailul
};
