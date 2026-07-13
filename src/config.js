const BASE_URL = import.meta.env.BASE_URL;

const galleryFiles = [
  "photo.jpg",
  ...Array.from(
    { length: 20 },
    (_, index) => `photo${String(index).padStart(2, "0")}.jpg`
  )
];

export const CONFIG = {
  groom: {
    name: import.meta.env.VITE_GROOM_NAME || "",
    phone: import.meta.env.VITE_GROOM_PHONE || "",
    father: import.meta.env.VITE_GROOM_FATHER || "",
    mother: import.meta.env.VITE_GROOM_MOTHER || "",
    motherPhone: import.meta.env.VITE_GROOM_MOTHER_PHONE || "",

    account: {
      bank: import.meta.env.VITE_GROOM_BANK || "",
      number: import.meta.env.VITE_GROOM_ACCOUNT || "",
      holder: import.meta.env.VITE_GROOM_HOLDER || ""
    },

    parentAccounts: [
      {
        relation: "어머니",
        name: import.meta.env.VITE_GROOM_MOTHER || "",
        bank: import.meta.env.VITE_GROOM_MOTHER_BANK || "",
        number: import.meta.env.VITE_GROOM_MOTHER_ACCOUNT || "",
        holder: import.meta.env.VITE_GROOM_MOTHER_HOLDER || ""
      }
    ]
  },

  bride: {
    name: import.meta.env.VITE_BRIDE_NAME || "",
    phone: import.meta.env.VITE_BRIDE_PHONE || "",
    father: import.meta.env.VITE_BRIDE_FATHER || "",
    fatherPhone: import.meta.env.VITE_BRIDE_FATHER_PHONE || "",
    mother: import.meta.env.VITE_BRIDE_MOTHER || "",
    motherPhone: import.meta.env.VITE_BRIDE_MOTHER_PHONE || "",

    account: {
      bank: import.meta.env.VITE_BRIDE_BANK || "",
      number: import.meta.env.VITE_BRIDE_ACCOUNT || "",
      holder: import.meta.env.VITE_BRIDE_HOLDER || ""
    },

    parentAccounts: [
      {
        relation: "아버지",
        name: import.meta.env.VITE_BRIDE_FATHER || "",
        bank: import.meta.env.VITE_BRIDE_FATHER_BANK || "",
        number: import.meta.env.VITE_BRIDE_FATHER_ACCOUNT || "",
        holder: import.meta.env.VITE_BRIDE_FATHER_HOLDER || ""
      },
      {
        relation: "어머니",
        name: import.meta.env.VITE_BRIDE_MOTHER || "",
        bank: import.meta.env.VITE_BRIDE_MOTHER_BANK || "",
        number: import.meta.env.VITE_BRIDE_MOTHER_ACCOUNT || "",
        holder: import.meta.env.VITE_BRIDE_MOTHER_HOLDER || ""
      }
    ]
  },

  wedding: {
    date: import.meta.env.VITE_WEDDING_DATE || "",
    dateText: import.meta.env.VITE_WEDDING_DATE_TEXT || "",
    venue: import.meta.env.VITE_WEDDING_VENUE || "",
    searchName:
      import.meta.env.VITE_WEDDING_SEARCH_NAME ||
      import.meta.env.VITE_WEDDING_VENUE ||
      "",
    address: import.meta.env.VITE_WEDDING_ADDRESS || "",
    lat: Number(import.meta.env.VITE_WEDDING_LAT),
    lng: Number(import.meta.env.VITE_WEDDING_LNG),

    transportation: {
      subway: [
        "2호선·7호선 건대입구역 5번 출구",
        "5번 출구 바로 앞, 도보 약 30m"
      ],
      busStop: "건대로데오거리입구 정류장 하차 [05218]",
      buses: [
        { type: "간선버스", numbers: "240, 721" },
        { type: "지선버스", numbers: "2222, 2224" },
        { type: "직행버스", numbers: "3500" },
        { type: "공항버스", numbers: "6013" },
        { type: "마을버스", numbers: "광진05" }
      ],
      car: [
        '내비게이션에서 "까사그랑데 센트로" 검색',
        '"서울 광진구 능동로 87" 검색',
        '"서울 광진구 자양동 2-2" 검색'
      ],
      parking: [
        "건물 내 B2층~B5층 주차장 이용",
        "외부 주차장은 현장 안내요원의 안내에 따라 이용",
        "예식 시간대에는 혼잡할 수 있어 대중교통 이용을 권장합니다."
      ]
    }
  },

  intro: {
    eyebrow: "Wedding Invitation",
    lines: [
      "춤이 이어준 인연,",
      "같은 리듬으로 함께 걸어온 시간.",
      "윤성 그리고 지온",
      "새로운 무대로 여러분을 초대합니다."
    ],
    buttonText: "청첩장 열기"
  },

  invitation: {
    message: import.meta.env.VITE_INVITATION_MESSAGE || ""
  },

  images: {
    main: `${BASE_URL}images/main.jpg`,
    gallery: galleryFiles.map(name => `${BASE_URL}images/${name}`)
  },

  music: {
    src: `${BASE_URL}music/wedding-bgm.mp3`,
    volume: 0.35
  },

  share: {
    title: import.meta.env.VITE_SHARE_TITLE || "",
    description: import.meta.env.VITE_SHARE_DESCRIPTION || "",
    imageUrl: import.meta.env.VITE_SHARE_IMAGE_URL || "",
    linkUrl:
      import.meta.env.VITE_SHARE_LINK_URL ||
      `${window.location.origin}/`
  }
};
