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
    },

    parentAccounts: [
      {
        relation: "아버지",
        name: import.meta.env.VITE_GROOM_FATHER,
        bank: import.meta.env.VITE_GROOM_FATHER_BANK,
        number: import.meta.env.VITE_GROOM_FATHER_ACCOUNT,
        holder: import.meta.env.VITE_GROOM_FATHER_HOLDER
      },
      {
        relation: "어머니",
        name: import.meta.env.VITE_GROOM_MOTHER,
        bank: import.meta.env.VITE_GROOM_MOTHER_BANK,
        number: import.meta.env.VITE_GROOM_MOTHER_ACCOUNT,
        holder: import.meta.env.VITE_GROOM_MOTHER_HOLDER
      }
    ]
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
    },

    parentAccounts: [
      {
        relation: "아버지",
        name: import.meta.env.VITE_BRIDE_FATHER,
        bank: import.meta.env.VITE_BRIDE_FATHER_BANK,
        number: import.meta.env.VITE_BRIDE_FATHER_ACCOUNT,
        holder: import.meta.env.VITE_BRIDE_FATHER_HOLDER
      },
      {
        relation: "어머니",
        name: import.meta.env.VITE_BRIDE_MOTHER,
        bank: import.meta.env.VITE_BRIDE_MOTHER_BANK,
        number: import.meta.env.VITE_BRIDE_MOTHER_ACCOUNT,
        holder: import.meta.env.VITE_BRIDE_MOTHER_HOLDER
      }
    ]
  },

  wedding: {
    date: import.meta.env.VITE_WEDDING_DATE,
    dateText: import.meta.env.VITE_WEDDING_DATE_TEXT,
    venue: import.meta.env.VITE_WEDDING_VENUE,
    address: import.meta.env.VITE_WEDDING_ADDRESS,
    lat: Number(import.meta.env.VITE_WEDDING_LAT),
    lng: Number(import.meta.env.VITE_WEDDING_LNG)
  },

  invitation: {

    message: import.meta.env.VITE_INVITATION_MESSAGE

  },

  images: {
    main: "/images/main.jpg",
    gallery: [
      "/images/photo.jpg",
      "/images/photo00.jpg",
      "/images/photo01.jpg",
      "/images/photo02.jpg",
      "/images/photo03.jpg",
      "/images/photo04.jpg",
      "/images/photo05.jpg",
      "/images/photo06.jpg",
      "/images/photo07.jpg",
      "/images/photo08.jpg",
      "/images/photo09.jpg",
      "/images/photo10.jpg",
      "/images/photo11.jpg",
      "/images/photo12.jpg",
      "/images/photo13.jpg",
      "/images/photo14.jpg",
      "/images/photo15.jpg",
      "/images/photo16.jpg",
      "/images/photo17.jpg",
      "/images/photo18.jpg",
      "/images/photo19.jpg"
    ]
  },

  music: {
    src: "/music/wedding-bgm.mp3",
    title: "Wedding BGM",
    volume: 0.35
  },

  share: {
    title: import.meta.env.VITE_SHARE_TITLE,
    description: import.meta.env.VITE_SHARE_DESCRIPTION,
    imageUrl: import.meta.env.VITE_SHARE_IMAGE_URL,
    linkUrl: import.meta.env.VITE_SHARE_LINK_URL
  }
};