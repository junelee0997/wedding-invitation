export const CONFIG = {
  groom: {
    name: import.meta.env.VITE_GROOM_NAME,
    phone: import.meta.env.VITE_GROOM_PHONE,
    father: import.meta.env.VITE_GROOM_FATHER,
    mother: import.meta.env.VITE_GROOM_MOTHER,
    account: {
      bank: import.meta.env.VITE_GROOM_BANK,
      number: import.meta.env.VITE_GROOM_ACCOUNT,
      holder: import.meta.env.VITE_GROOM_HOLDER
    }
  },

  bride: {
    name: import.meta.env.VITE_BRIDE_NAME,
    phone: import.meta.env.VITE_BRIDE_PHONE,
    father: import.meta.env.VITE_BRIDE_FATHER,
    mother: import.meta.env.VITE_BRIDE_MOTHER,
    account: {
      bank: import.meta.env.VITE_BRIDE_BANK,
      number: import.meta.env.VITE_BRIDE_ACCOUNT,
      holder: import.meta.env.VITE_BRIDE_HOLDER
    }
  },

  wedding: {
    date: import.meta.env.VITE_WEDDING_DATE,
    dateText: import.meta.env.VITE_WEDDING_DATE_TEXT,
    venue: import.meta.env.VITE_WEDDING_VENUE,
    address: import.meta.env.VITE_WEDDING_ADDRESS,
    lat: Number(import.meta.env.VITE_WEDDING_LAT),
    lng: Number(import.meta.env.VITE_WEDDING_LNG)
  },

  images: {
    main: "/images/main.jpg",
    gallery: [
      "/images/gallery1.jpg",
      "/images/gallery2.jpg",
      "/images/gallery3.jpg",
      "/images/gallery4.jpg"
    ]
  },

  share: {
    title: import.meta.env.VITE_SHARE_TITLE,
    description: import.meta.env.VITE_SHARE_DESCRIPTION,
    imageUrl: import.meta.env.VITE_SHARE_IMAGE_URL,
    linkUrl: import.meta.env.VITE_SHARE_LINK_URL
  }
};