import "./style.css";
import { CONFIG } from "./config.js";

const NAVER_MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
const KAKAO_SDK_JS_KEY = import.meta.env.VITE_KAKAO_SDK_JS_KEY;

function $(selector) {
  return document.querySelector(selector);
}

function init() {
  blockImageSave();

  document.documentElement.style.setProperty(
    "--main-image",
    `url("${CONFIG.images.main}")`
  );

  document.title = `${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 모바일 청첩장`;

  $("#coupleTitle").innerText = `${CONFIG.groom.name} ♥ ${CONFIG.bride.name}`;
  $("#weddingDate").innerText = CONFIG.wedding.dateText;
  $("#dateText").innerText = CONFIG.wedding.dateText;
  $("#venueText").innerText = CONFIG.wedding.venue;
  $("#addressText").innerText = CONFIG.wedding.address;
  $("#mapVenue").innerText = CONFIG.wedding.venue;
  $("#mapAddress").innerText = CONFIG.wedding.address;
  $("#invitationMessage").innerText = CONFIG.invitation.message;
  $("#parentsInfo").innerHTML = `
    ${CONFIG.groom.father} · ${CONFIG.groom.mother}의 아들 ${CONFIG.groom.name}<br />
    ${CONFIG.bride.father} · ${CONFIG.bride.mother}의 딸 ${CONFIG.bride.name}
  `;

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

function renderGallery() {
  $("#gallery").innerHTML = CONFIG.images.gallery
    .map(
      src => `
      <div class="gallery-item">
        <img src="${src}" alt="wedding photo" draggable="false" />
      </div>
    `
    )
    .join("");
}

function blockImageSave() {
  document.addEventListener("contextmenu", e => {
    if (e.target.tagName === "IMG") {
      e.preventDefault();
    }
  });

  document.addEventListener("dragstart", e => {
    if (e.target.tagName === "IMG") {
      e.preventDefault();
    }
  });
}

function renderCalendar() {
  const calendar = $("#calendar");
  const date = new Date(CONFIG.wedding.date);

  const year = date.getFullYear();
  const month = date.getMonth();
  const targetDay = date.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const labels = ["일", "월", "화", "수", "목", "금", "토"];

  calendar.innerHTML = labels.map(day => `<div>${day}</div>`).join("");

  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += "<div></div>";
  }

  for (let day = 1; day <= lastDate; day++) {
    const cls = day === targetDay ? "target-day" : "";
    calendar.innerHTML += `<div class="${cls}">${day}</div>`;
  }
}

function renderContacts() {
  $("#groomCall").href = `tel:${CONFIG.groom.phone}`;
  $("#groomSms").href = `sms:${CONFIG.groom.phone}`;
  $("#brideCall").href = `tel:${CONFIG.bride.phone}`;
  $("#brideSms").href = `sms:${CONFIG.bride.phone}`;
}

function renderNaverMap() {

  if (!NAVER_MAP_CLIENT_ID) {

    console.warn("VITE_NAVER_MAP_CLIENT_ID가 설정되지 않았습니다.");

    return;

  }

  const script = document.createElement("script");

  script.src =

    `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;

  script.onload = () => {

    const position = new naver.maps.LatLng(

      CONFIG.wedding.lat,

      CONFIG.wedding.lng

    );

    const map = new naver.maps.Map("naverMap", {

      center: position,

      zoom: 16

    });

    new naver.maps.Marker({

      position,

      map

    });

  };

  document.head.appendChild(script);

  const query = encodeURIComponent(

    `${CONFIG.wedding.venue} ${CONFIG.wedding.address}`

  );

  const lat = CONFIG.wedding.lat;

  const lng = CONFIG.wedding.lng;

  const name = encodeURIComponent(CONFIG.wedding.venue);

  // 네이버 지도에서 장소 검색

  $("#naverMapLink").href =

    `https://map.naver.com/v5/search/${query}`;

  // 네이버 길찾기: 도착지만 지정

  $("#naverDirectionLink").href =

  `https://map.naver.com/p/directions/-/${lng},${lat},${name},PLACE_POI/-/transit`;

}

function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const target = new Date(CONFIG.wedding.date).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    $("#ddayText").innerText = "오늘은 두 사람의 결혼식 날입니다.";

    $("#days").innerText = 0;
    $("#hours").innerText = 0;
    $("#minutes").innerText = 0;
    $("#seconds").innerText = 0;

    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  $("#days").innerText = days;
  $("#hours").innerText = hours;
  $("#minutes").innerText = minutes;
  $("#seconds").innerText = seconds;

  $("#ddayText").innerText =
    `결혼식까지 ${days}일 ${hours}시간 ${minutes}분 남았습니다.`;
}

function renderAccounts() {
  $("#groomAccount").innerHTML = sideAccountTemplate(
    "신랑",
    CONFIG.groom.account,
    CONFIG.groom.parentAccounts
  );

  $("#brideAccount").innerHTML = sideAccountTemplate(
    "신부",
    CONFIG.bride.account,
    CONFIG.bride.parentAccounts
  );
}

function sideAccountTemplate(sideLabel, mainAccount, parentAccounts) {
  const accounts = [
    {
      label: sideLabel,
      ...mainAccount
    },
    ...parentAccounts
      .filter(account => account.bank && account.number)
      .map(account => ({
        label: `${sideLabel} ${account.relation}`,
        bank: account.bank,
        number: account.number,
        holder: account.holder || account.name
      }))
  ];

  return accounts.map(accountRowTemplate).join("");
}

function accountRowTemplate(account) {
  const copyText = `${account.bank} ${account.number}`;

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
      const id = button.dataset.account;
      document.getElementById(id).classList.toggle("show");
    });
  });

  document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.copy);
      alert("계좌번호가 복사되었습니다.");
    });
  });
}

function initLightbox() {
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const close = $("#lightboxClose");

  document.querySelectorAll(".gallery img").forEach(img => {
    img.addEventListener("click", () => {
      lightboxImage.src = img.src;
      lightbox.classList.add("show");
    });
  });

  close.addEventListener("click", () => {
    lightbox.classList.remove("show");
  });

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
      lightbox.classList.remove("show");
    }
  });
}

function initHeroSlider() {
  const slides = [CONFIG.images.main, ...CONFIG.images.gallery];
  let index = 0;

  setInterval(() => {
    index = (index + 1) % slides.length;

    document.documentElement.style.setProperty(
      "--main-image",
      `url("${slides[index]}")`
    );
  }, 4000);
}

function initKakaoShare() {
  if (!KAKAO_SDK_JS_KEY) {
    console.warn("VITE_KAKAO_SDK_JS_KEY가 설정되지 않았습니다.");
    return;
  }

  const script = document.createElement("script");

  script.src = "https://developers.kakao.com/sdk/js/kakao.js";

  script.onload = () => {
    if (window.Kakao && !Kakao.isInitialized()) {
      Kakao.init(KAKAO_SDK_JS_KEY);
    }
  };

  document.head.appendChild(script);

  $("#kakaoShareBtn").addEventListener("click", () => {
    if (!window.Kakao || !Kakao.isInitialized()) {
      alert("카카오 공유 설정을 확인해주세요.");
      return;
    }

    Kakao.Share.sendDefault({

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
    
            mobileWebUrl: `https://map.naver.com/p/search/${encodeURIComponent(
    
              `${CONFIG.wedding.venue} ${CONFIG.wedding.address}`
    
            )}`,
    
            webUrl: `https://map.naver.com/p/search/${encodeURIComponent(
    
              `${CONFIG.wedding.venue} ${CONFIG.wedding.address}`
    
            )}`
    
          }
    
        }
    
      ]
    
    });
  });
}

function initNativeShare() {
  $("#nativeShareBtn").addEventListener("click", async () => {
    const shareData = {
      title: CONFIG.share.title,
      text: CONFIG.share.description,
      url: CONFIG.share.linkUrl
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(CONFIG.share.linkUrl);
      alert("청첩장 링크가 복사되었습니다.");
    }
  });
}
function initMusic() {

  const audio = $("#weddingBgm");

  const button = $("#musicToggleBtn");

  if (!audio || !button || !CONFIG.music.src) {

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

      playing ? "배경음악 일시정지" : "배경음악 재생"

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

  button.addEventListener("click", async () => {

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

  // 브라우저 정책상 자동재생이 허용되는 경우에만 바로 재생됨

  playMusic();

  // 자동재생이 차단된 경우 사용자의 첫 터치/클릭 이후 한 번 재시도

  const startAfterInteraction = async () => {

    if (!playing) {

      await playMusic();

    }

    document.removeEventListener("click", startAfterInteraction);

    document.removeEventListener("touchstart", startAfterInteraction);

  };

  document.addEventListener("click", startAfterInteraction, { once: true });

  document.addEventListener("touchstart", startAfterInteraction, { once: true });

}
init();