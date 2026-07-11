const BASE_URL = import.meta.env.BASE_URL;

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

    message: import.meta.env.VITE_INVITATION_MESSAGE || ""

  },

  images: {

    main: `${BASE_URL}images/main.jpg`,

    gallery: [

      `${BASE_URL}images/photo.jpg`,

      `${BASE_URL}images/photo00.jpg`,

      `${BASE_URL}images/photo01.jpg`,

      `${BASE_URL}images/photo02.jpg`,

      `${BASE_URL}images/photo03.jpg`,

      `${BASE_URL}images/photo04.jpg`,

      `${BASE_URL}images/photo05.jpg`,

      `${BASE_URL}images/photo06.jpg`,

      `${BASE_URL}images/photo07.jpg`,

      `${BASE_URL}images/photo08.jpg`,

      `${BASE_URL}images/photo09.jpg`,

      `${BASE_URL}images/photo10.jpg`,

      `${BASE_URL}images/photo11.jpg`,

      `${BASE_URL}images/photo12.jpg`,

      `${BASE_URL}images/photo13.jpg`,

      `${BASE_URL}images/photo14.jpg`,

      `${BASE_URL}images/photo15.jpg`,

      `${BASE_URL}images/photo16.jpg`,

      `${BASE_URL}images/photo17.jpg`,

      `${BASE_URL}images/photo18.jpg`,

      `${BASE_URL}images/photo19.jpg`

    ]

  },

  music: {

    src: `${BASE_URL}music/wedding-bgm.mp3`,

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