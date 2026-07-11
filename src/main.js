import "./style.css";
import { CONFIG } from "./config.js";

const NAVER_MAP_CLIENT_ID =
  import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

const KAKAO_SDK_JS_KEY =
  import.meta.env.VITE_KAKAO_SDK_JS_KEY;

function $(selector) {
  return document.querySelector(selector);
}

function setText(selector, value = "") {
  const element = $(selector);

  if (element) {
    element.innerText = value;
  }
}

function init() {
  blockImageSave();

  document.documentElement.style.setProperty(
    "--main-image",
    `url("${CONFIG.images.main}")`
  );

  document.title =
    `${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 모바일 청첩장`;

  setText(
    "#coupleTitle",
    `${CONFIG.groom.name} ♥ ${CONFIG.bride.name}`
  );

  setText("#weddingDate", CONFIG.wedding.dateText);
  setText("#dateText", CONFIG.wedding.dateText);
  setText("#venueText", CONFIG.wedding.venue);
  setText("#addressText", CONFIG.wedding.address);
  setText("#mapVenue", CONFIG.wedding.venue);
  setText("#mapAddress", CONFIG.wedding.address);
  setText("#invitationMessage", CONFIG.invitation.message);

  const parentsInfo = $("#parentsInfo");

  if (parentsInfo) {
    parentsInfo.innerHTML = `
      ${CONFIG.groom.father} · ${CONFIG.groom.mother}의 아들
      ${CONFIG.groom.name}<br />
      ${CONFIG.bride.father} · ${CONFIG.bride.mother}의 딸
      ${CONFIG.bride.name}
    `;
  }

  renderGallery();
  renderCalendar();
  renderAccounts();
  renderContacts();
  renderNaverMap();

  initLightbox();
  initHeroSlider();
  initCountdown();
  initKakaoShare();
  initNativeShare();
  initMusic();
  bindAccountButtons();
}

/* --------------------
   갤러리
-------------------- */

function renderGallery() {
  const gallery = $("#gallery");

  if (!gallery) {
    return;
  }

  gallery.innerHTML = CONFIG.images.gallery
    .map(
      (src, index) => `
        <div class="gallery-item">
          <img
            src="${src}"
            alt="웨딩 사진 ${index + 1}"
            draggable="false"
            loading="lazy"
            decoding="async"
          />
        </div>
      `
    )
    .join("");

  // 실제 파일이 없는 경우 깨진 사진 칸을 자동 제거
  gallery.querySelectorAll("img").forEach(image => {
    image.addEventListener("error", () => {
      image.closest(".gallery-item")?.remove();
    });
  });
}

function blockImageSave() {
  document.addEventListener("contextmenu", event => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", event => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });
}

function initLightbox() {
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const closeButton = $("#lightboxClose");
  const gallery = $("#gallery");

  if (!lightbox || !lightboxImage || !closeButton || !gallery) {
    return;
  }

  const closeLightbox = () => {
    lightbox.classList.remove("show");
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("modal-open");
  };

  gallery.addEventListener("click", event => {
    const image = event.target.closest("img");

    if (!image) {
      return;
    }

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("show");
    document.body.classList.add("modal-open");
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

/* --------------------
   메인 이미지 슬라이드
-------------------- */

function initHeroSlider() {
  // 지나치게 많은 사진을 배경으로 불러오지 않도록 최대 5장만 사용
  const slides = [
    CONFIG.images.main,
    ...CONFIG.images.gallery.slice(0, 4)
  ];

  if (slides.length <= 1) {
    return;
  }

  let index = 0;

  // 다음 사진 미리 불러오기
  slides.slice(1).forEach(src => {
    const image = new Image();
    image.src = src;
  });

  window.setInterval(() => {
    index = (index + 1) % slides.length;

    document.documentElement.style.setProperty(
      "--main-image",
      `url("${slides[index]}")`
    );
  }, 5000);
}

/* --------------------
   달력과 카운트다운
-------------------- */

function renderCalendar() {
  const calendar = $("#calendar");
  const date = new Date(CONFIG.wedding.date);

  if (!calendar || Number.isNaN(date.getTime())) {
    return;
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const targetDay = date.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const labels = ["일", "월", "화", "수", "목", "금", "토"];

  const cells = labels.map(
    day => `<div class="calendar-header">${day}</div>`
  );

  for (let index = 0; index < firstDay; index += 1) {
    cells.push("<div></div>");
  }

  for (let day = 1; day <= lastDate; day += 1) {
    const className =
      day === targetDay ? "target-day" : "";

    cells.push(
      `<div class="${className}">${day}</div>`
    );
  }

  calendar.innerHTML = cells.join("");
}

function initCountdown() {
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const target = new Date(CONFIG.wedding.date).getTime();

  if (Number.isNaN(target)) {
    setText("#ddayText", "");
    return;
  }

  const diff = target - Date.now();

  if (diff <= 0) {
    setText(
      "#ddayText",
      "오늘은 두 사람의 결혼식 날입니다."
    );

    setText("#days", "0");
    setText("#hours", "0");
    setText("#minutes", "0");
    setText("#seconds", "0");

    return;
  }

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000) % 24;
  const minutes = Math.floor(diff / 60_000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  setText("#days", String(days));
  setText("#hours", String(hours));
  setText("#minutes", String(minutes));
  setText("#seconds", String(seconds));

  setText(
    "#ddayText",
    `결혼식까지 ${days}일 ${hours}시간 ${minutes}분 남았습니다.`
  );
}

/* --------------------
   연락처
-------------------- */

function renderContacts() {
  const contacts = [
    ["#groomCall", `tel:${CONFIG.groom.phone}`],
    ["#groomSms", `sms:${CONFIG.groom.phone}`],
    ["#brideCall", `tel:${CONFIG.bride.phone}`],
    ["#brideSms", `sms:${CONFIG.bride.phone}`]
  ];

  contacts.forEach(([selector, href]) => {
    const element = $(selector);

    if (element) {
      element.href = href;
    }
  });
}

/* --------------------
   네이버 지도
-------------------- */

function renderNaverMap() {

  const mapElement = $("#naverMap");

  const mapLink = $("#naverMapLink");

  const directionLink = $("#naverDirectionLink");

  // 네이버 지도 검색에는 이 문구만 사용

  const searchName = "까사그랑데 센트로";

  const searchQuery = encodeURIComponent(searchName);

  const destinationName = encodeURIComponent(searchName);

  const { lat, lng } = CONFIG.wedding;

  if (mapLink) {

    mapLink.href =

      `https://map.naver.com/p/search/${searchQuery}`;

  }

  if (directionLink) {

    directionLink.href =

      `https://map.naver.com/p/directions/-/` +

      `${lng},${lat},${destinationName},PLACE_POI/-/transit`;

  }

  if (!NAVER_MAP_CLIENT_ID || !mapElement) {

    console.warn("네이버 지도 Client ID 또는 지도 요소가 없습니다.");

    return;

  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {

    console.warn("웨딩홀 위도·경도 값이 올바르지 않습니다.");

    return;

  }

  const createMap = () => {

    const position = new window.naver.maps.LatLng(lat, lng);

    const map = new window.naver.maps.Map("naverMap", {

      center: position,

      zoom: 17,

      zoomControl: true,

      zoomControlOptions: {

        position: window.naver.maps.Position.TOP_RIGHT

      }

    });

    const marker = new window.naver.maps.Marker({

      position,

      map,

      title: searchName

    });

    window.naver.maps.Event.addListener(marker, "click", () => {

      window.open(

        `https://map.naver.com/p/search/${searchQuery}`,

        "_blank",

        "noopener,noreferrer"

      );

    });

  };

  if (window.naver?.maps) {

    createMap();

    return;

  }

  const script = document.createElement("script");

  script.src =

    "https://oapi.map.naver.com/openapi/v3/maps.js" +

    `?ncpKeyId=${encodeURIComponent(NAVER_MAP_CLIENT_ID)}`;

  script.async = true;

  script.defer = true;

  script.onload = createMap;

  script.onerror = () => {

    console.error("네이버 지도 SDK를 불러오지 못했습니다.");

    mapElement.innerHTML = `

      <p class="map-error">

        지도를 불러오지 못했습니다.<br />

        아래의 네이버 지도 버튼을 이용해 주세요.

      </p>

    `;

  };

  document.head.appendChild(script);

}

/* --------------------
   계좌
-------------------- */

function renderAccounts() {
  const groomAccount = $("#groomAccount");
  const brideAccount = $("#brideAccount");

  if (groomAccount) {
    groomAccount.innerHTML = sideAccountTemplate(
      "신랑",
      CONFIG.groom.account,
      CONFIG.groom.parentAccounts
    );
  }

  if (brideAccount) {
    brideAccount.innerHTML = sideAccountTemplate(
      "신부",
      CONFIG.bride.account,
      CONFIG.bride.parentAccounts
    );
  }
}

function sideAccountTemplate(
  sideLabel,
  mainAccount,
  parentAccounts = []
) {
  const accounts = [];

  if (mainAccount?.bank && mainAccount?.number) {
    accounts.push({
      label: sideLabel,
      ...mainAccount
    });
  }

  parentAccounts
    .filter(account => account.bank && account.number)
    .forEach(account => {
      accounts.push({
        label: `${sideLabel} ${account.relation}`,
        bank: account.bank,
        number: account.number,
        holder: account.holder || account.name
      });
    });

  return accounts
    .map(accountRowTemplate)
    .join("");
}

function accountRowTemplate(account) {
  const copyText =
    `${account.bank} ${account.number} ${account.holder}`;

  return `
    <div class="account-item">
      <div class="account-info">
        <span class="account-label">${account.label}</span>
        <strong>${account.holder}</strong>
        <span>${account.bank} ${account.number}</span>
      </div>

      <button
        class="copy-btn"
        type="button"
        data-copy="${copyText}"
      >
        복사
      </button>
    </div>
  `;
}

function bindAccountButtons() {
  document.querySelectorAll("[data-account]").forEach(button => {
    button.addEventListener("click", () => {
      const accountId = button.dataset.account;
      const accountElement = document.getElementById(accountId);

      if (!accountElement) {
        return;
      }

      const opened = accountElement.classList.toggle("show");

      button.setAttribute(
        "aria-expanded",
        String(opened)
      );
    });
  });

  document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(
          button.dataset.copy || ""
        );

        const previousText = button.innerText;
        button.innerText = "완료";

        window.setTimeout(() => {
          button.innerText = previousText;
        }, 1200);
      } catch {
        alert("계좌번호를 복사하지 못했습니다.");
      }
    });
  });
}

/* --------------------
   카카오 공유
-------------------- */

function initKakaoShare() {
  const shareButton = $("#kakaoShareBtn");

  if (!shareButton) {
    return;
  }

  if (!KAKAO_SDK_JS_KEY) {
    console.warn("카카오 JavaScript 키가 없습니다.");
    shareButton.disabled = true;
    return;
  }

  const initializeKakao = () => {
    if (
      window.Kakao &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init(KAKAO_SDK_JS_KEY);
    }
  };

  if (!window.Kakao) {
    const script = document.createElement("script");

    script.src =
      "https://developers.kakao.com/sdk/js/kakao.js";

    script.async = true;
    script.onload = initializeKakao;
    script.onerror = () => {
      console.error("카카오 SDK를 불러오지 못했습니다.");
    };

    document.head.appendChild(script);
  } else {
    initializeKakao();
  }

  shareButton.addEventListener("click", () => {
    if (
      !window.Kakao ||
      !window.Kakao.isInitialized()
    ) {
      alert("카카오 공유 기능을 준비하고 있습니다.");
      return;
    }

    const locationUrl = new URL(
      CONFIG.share.linkUrl,
      window.location.href
    );

    locationUrl.hash = "location";

    window.Kakao.Share.sendDefault({
      objectType: "feed",

      content: {
        title: CONFIG.share.title,
        description: CONFIG.share.description,
        imageUrl: CONFIG.share.imageUrl,

        link: {
          mobileWebUrl: CONFIG.share.linkUrl,
          webUrl: CONFIG.share.linkUrl
        }
      },

      buttons: [
        {
          title: "청첩장 보기",
          link: {
            mobileWebUrl: CONFIG.share.linkUrl,
            webUrl: CONFIG.share.linkUrl
          }
        },
        {
          title: "위치 보기",
          link: {
            mobileWebUrl: locationUrl.toString(),
            webUrl: locationUrl.toString()
          }
        }
      ]
    });
  });
}

function initNativeShare() {
  const shareButton = $("#nativeShareBtn");

  if (!shareButton) {
    return;
  }

  shareButton.addEventListener("click", async () => {
    const shareData = {
      title: CONFIG.share.title,
      text: CONFIG.share.description,
      url: CONFIG.share.linkUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(
        CONFIG.share.linkUrl
      );

      alert("청첩장 링크가 복사되었습니다.");
    } catch (error) {
      if (error?.name !== "AbortError") {
        alert("공유 기능을 사용할 수 없습니다.");
      }
    }
  });
}

/* --------------------
   배경음악
-------------------- */

function initMusic() {
  const audio = $("#weddingBgm");
  const button = $("#musicToggleBtn");

  if (!audio || !button || !CONFIG.music?.src) {
    return;
  }

  audio.src = CONFIG.music.src;
  audio.volume = CONFIG.music.volume ?? 0.35;

  let playing = false;

  const updateButton = () => {
    button.classList.toggle("playing", playing);
    button.innerText = playing ? "Ⅱ" : "♪";

    button.setAttribute(
      "aria-label",
      playing
        ? "배경음악 일시정지"
        : "배경음악 재생"
    );
  };

  const playMusic = async () => {
    try {
      await audio.play();
      playing = true;
      updateButton();
    } catch {
      playing = false;
      updateButton();
    }
  };

  const pauseMusic = () => {
    audio.pause();
    playing = false;
    updateButton();
  };

  button.addEventListener("click", async event => {
    event.stopPropagation();

    if (playing) {
      pauseMusic();
    } else {
      await playMusic();
    }
  });

  audio.addEventListener("play", () => {
    playing = true;
    updateButton();
  });

  audio.addEventListener("pause", () => {
    playing = false;
    updateButton();
  });

  audio.addEventListener("error", () => {
    button.hidden = true;
  });

  // 정책상 허용될 경우에만 자동재생됨
  playMusic();

  // 자동재생 차단 시 첫 사용자 입력 후 재시도
  const startAfterInteraction = async event => {
    if (event.target.closest("#musicToggleBtn")) {
      return;
    }

    if (!playing) {
      await playMusic();
    }

    document.removeEventListener(
      "pointerdown",
      startAfterInteraction
    );
  };

  document.addEventListener(
    "pointerdown",
    startAfterInteraction,
    { once: true }
  );
}

init();