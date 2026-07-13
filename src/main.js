import "./style.css";
import { CONFIG } from "./config.js";

const NAVER_MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
const KAKAO_SDK_JS_KEY = import.meta.env.VITE_KAKAO_SDK_JS_KEY;

const $ = selector => document.querySelector(selector);

function setText(selector, value = "") {
  const element = $(selector);
  if (element) element.textContent = value;
}

function sleep(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

async function typeLine(container, text, speed = 75) {
  const line = document.createElement("p");
  line.className = "intro-handwriting-line";
  container.appendChild(line);

  for (const character of text) {
    line.textContent += character;
    await sleep(character === " " ? speed * 0.45 : speed);
  }

  await sleep(280);
}

async function initIntro() {
  const overlay = $("#introOverlay");
  const eyebrow = $("#introEyebrow");
  const typing = $("#introTyping");
  const enterButton = $("#enterInvitationBtn");

  if (!overlay || !eyebrow || !typing || !enterButton) {
    document.body.classList.remove("intro-locked");
    return;
  }

  eyebrow.textContent = CONFIG.intro.eyebrow;
  enterButton.textContent = CONFIG.intro.buttonText;

  await sleep(500);

  for (const line of CONFIG.intro.lines) {
    await typeLine(typing, line, 72);
  }

  enterButton.hidden = false;
  requestAnimationFrame(() => {
    enterButton.classList.add("show");
  });

  enterButton.addEventListener("click", async () => {
    overlay.classList.add("closing");
    document.body.classList.remove("intro-locked");

    await tryPlayMusic();

    window.setTimeout(() => {
      overlay.remove();
    }, 900);
  });
}

function init() {
  document.documentElement.style.setProperty(
    "--main-image",
    `url("${CONFIG.images.main}")`
  );

  document.title =
    `${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 모바일 청첩장`;

  setText("#coupleTitle", `${CONFIG.groom.name} ♥ ${CONFIG.bride.name}`);
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
      ${CONFIG.groom.father} · ${CONFIG.groom.mother}의 아들 ${CONFIG.groom.name}<br />
      ${CONFIG.bride.father} · ${CONFIG.bride.mother}의 딸 ${CONFIG.bride.name}
    `;
  }

  blockImageSave();
  renderGallerySlider();
  renderCalendar();
  initCountdown();
  renderTransportation();
  renderContacts();
  renderAccounts();
  bindAccountButtons();
  renderNaverMap();
  initKakaoShare();
  initCopyLink();
  initMusic();
  initIntro();
  initScrollReveal();
}
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".section, footer"
  );

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(element => {
      element.classList.add("reveal-visible");
    });

    return;
  }

  revealElements.forEach((element, index) => {
    element.classList.add("reveal-item");

    element.style.setProperty(
      "--reveal-delay",
      `${Math.min(index * 70, 280)}ms`
    );
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealElements.forEach(element => {
    observer.observe(element);
  });
}
function blockImageSave() {
  document.addEventListener("contextmenu", event => {
    if (event.target instanceof HTMLImageElement) event.preventDefault();
  });

  document.addEventListener("dragstart", event => {
    if (event.target instanceof HTMLImageElement) event.preventDefault();
  });
}

function renderGallerySlider() {
  const slider = $("#gallerySlider");
  const prevButton = $("#galleryPrev");
  const nextButton = $("#galleryNext");
  const counter = $("#galleryCounter");
  const dots = $("#galleryDots");

  if (!slider || !prevButton || !nextButton || !counter || !dots) return;

  let currentIndex = 0;
  let validSlides = [];
  let touchStartX = 0;

  slider.innerHTML = CONFIG.images.gallery.map((src, index) => `
    <div class="gallery-slide">
      <img
        src="${src}"
        alt="웨딩 사진 ${index + 1}"
        draggable="false"
        loading="${index < 2 ? "eager" : "lazy"}"
        decoding="async"
      />
    </div>
  `).join("");

  function refreshSlides() {
    validSlides = [...slider.querySelectorAll(".gallery-slide")]
      .filter(slide => !slide.classList.contains("broken"));

    dots.innerHTML = validSlides.map((_, index) => `
      <button
        class="gallery-dot ${index === currentIndex ? "active" : ""}"
        type="button"
        aria-label="${index + 1}번 사진"
        data-index="${index}"
      ></button>
    `).join("");

    updateSlider(false);
  }

  function updateSlider(animate = true) {
    if (!validSlides.length) {
      counter.textContent = "0 / 0";
      return;
    }

    currentIndex =
      (currentIndex + validSlides.length) % validSlides.length;

    validSlides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentIndex);
    });

    slider.style.transition = animate
      ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";

    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    counter.textContent =
      `${currentIndex + 1} / ${validSlides.length}`;

    dots.querySelectorAll(".gallery-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  slider.querySelectorAll("img").forEach(image => {
    image.addEventListener("error", () => {
      image.closest(".gallery-slide")?.classList.add("broken");
      refreshSlides();
    });
  });

  prevButton.addEventListener("click", () => {
    currentIndex -= 1;
    updateSlider();
  });

  nextButton.addEventListener("click", () => {
    currentIndex += 1;
    updateSlider();
  });

  dots.addEventListener("click", event => {
    const button = event.target.closest("[data-index]");
    if (!button) return;

    currentIndex = Number(button.dataset.index);
    updateSlider();
  });

  slider.addEventListener(
    "touchstart",
    event => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    event => {
      const distance =
        event.changedTouches[0].clientX - touchStartX;

      if (Math.abs(distance) < 45) return;

      currentIndex += distance > 0 ? -1 : 1;
      updateSlider();
    },
    { passive: true }
  );

  refreshSlides();
}

function renderCalendar() {
  const calendar = $("#calendar");
  const date = new Date(CONFIG.wedding.date);

  if (!calendar || Number.isNaN(date.getTime())) return;

  const year = date.getFullYear();
  const month = date.getMonth();
  const targetDay = date.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const cells = ["일", "월", "화", "수", "목", "금", "토"]
    .map(day => `<div class="calendar-header">${day}</div>`);

  for (let index = 0; index < firstDay; index += 1) {
    cells.push("<div></div>");
  }

  for (let day = 1; day <= lastDate; day += 1) {
    cells.push(`
      <div class="${day === targetDay ? "target-day" : ""}">
        ${day}
      </div>
    `);
  }

  calendar.innerHTML = cells.join("");
}

function initCountdown() {
  const update = () => {
    const target = new Date(CONFIG.wedding.date).getTime();

    if (Number.isNaN(target)) return;

    const diff = target - Date.now();

    if (diff <= 0) {
      setText("#ddayText", "오늘은 두 사람의 결혼식 날입니다.");
      ["days", "hours", "minutes", "seconds"]
        .forEach(id => setText(`#${id}`, "0"));
      return;
    }

    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor(diff / 3_600_000) % 24;
    const minutes = Math.floor(diff / 60_000) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    setText("#days", days);
    setText("#hours", hours);
    setText("#minutes", minutes);
    setText("#seconds", seconds);

    setText(
      "#ddayText",
      `결혼식까지 ${days}일 ${hours}시간 ${minutes}분 남았습니다.`
    );
  };

  update();
  window.setInterval(update, 1000);
}

function renderTransportation() {
  const transportation = CONFIG.wedding.transportation;

  const subwayGuide = $("#subwayGuide");
  if (subwayGuide) {
    subwayGuide.innerHTML = transportation.subway
      .map(item => `<li>${item}</li>`)
      .join("");
  }

  setText("#busStopText", transportation.busStop);

  const busGuide = $("#busGuide");
  if (busGuide) {
    busGuide.innerHTML = transportation.buses
      .map(bus => `
        <div class="bus-row">
          <span class="bus-type">${bus.type}</span>
          <span>${bus.numbers}</span>
        </div>
      `)
      .join("");
  }

  const carGuide = $("#carGuide");
  if (carGuide) {
    carGuide.innerHTML = transportation.car
      .map(item => `<li>${item}</li>`)
      .join("");
  }

  const parkingGuide = $("#parkingGuide");
  if (parkingGuide) {
    parkingGuide.innerHTML = transportation.parking
      .map(item => `<li>${item}</li>`)
      .join("");
  }
}

function setContact(selector, scheme, phone) {
  const element = $(selector);

  if (!element || !phone) {
    element?.remove();
    return;
  }

  element.href = `${scheme}:${phone}`;
}

function renderContacts() {
  setText("#groomContactName", CONFIG.groom.name);
  setText("#groomMotherContactName", CONFIG.groom.mother);
  setText("#brideContactName", CONFIG.bride.name);
  setText("#brideFatherContactName", CONFIG.bride.father);
  setText("#brideMotherContactName", CONFIG.bride.mother);

  setContact("#groomCall", "tel", CONFIG.groom.phone);
  setContact("#groomSms", "sms", CONFIG.groom.phone);
  setContact("#groomMotherCall", "tel", CONFIG.groom.motherPhone);
  setContact("#groomMotherSms", "sms", CONFIG.groom.motherPhone);

  setContact("#brideCall", "tel", CONFIG.bride.phone);
  setContact("#brideSms", "sms", CONFIG.bride.phone);
  setContact("#brideFatherCall", "tel", CONFIG.bride.fatherPhone);
  setContact("#brideFatherSms", "sms", CONFIG.bride.fatherPhone);
  setContact("#brideMotherCall", "tel", CONFIG.bride.motherPhone);
  setContact("#brideMotherSms", "sms", CONFIG.bride.motherPhone);
}

function renderAccounts() {
  const renderSide = (selector, side, main, parents = []) => {
    const root = $(selector);
    if (!root) return;

    const accounts = [];

    if (main?.bank && main?.number) {
      accounts.push({
        label: side,
        ...main
      });
    }

    parents
      .filter(account => account.bank && account.number)
      .forEach(account => {
        accounts.push({
          label: `${side} ${account.relation}`,
          bank: account.bank,
          number: account.number,
          holder: account.holder || account.name
        });
      });

    root.innerHTML = accounts.map(account => `
      <div class="account-item">
        <div class="account-info">
          <span class="account-label">${account.label}</span>
          <strong>${account.holder}</strong>
          <span>${account.bank} ${account.number}</span>
        </div>

        <button
          class="copy-btn"
          type="button"
          data-copy="${account.bank} ${account.number} ${account.holder}"
        >
          복사
        </button>
      </div>
    `).join("");
  };

  renderSide(
    "#groomAccount",
    "신랑",
    CONFIG.groom.account,
    CONFIG.groom.parentAccounts
  );

  renderSide(
    "#brideAccount",
    "신부",
    CONFIG.bride.account,
    CONFIG.bride.parentAccounts
  );
}

function bindAccountButtons() {
  document.querySelectorAll("[data-account]").forEach(button => {
    button.addEventListener("click", () => {
      const panel =
        document.getElementById(button.dataset.account);

      if (!panel) return;

      const opened = panel.classList.toggle("show");
      button.setAttribute("aria-expanded", String(opened));
    });
  });

  document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(
          button.dataset.copy || ""
        );

        const previousText = button.textContent;
        button.textContent = "완료";

        window.setTimeout(() => {
          button.textContent = previousText;
        }, 1200);
      } catch {
        alert("계좌번호를 복사하지 못했습니다.");
      }
    });
  });
}

function renderNaverMap() {
  const mapElement = $("#naverMap");
  const mapLink = $("#naverMapLink");
  const directionLink = $("#naverDirectionLink");

  const searchName = CONFIG.wedding.searchName.trim();
  const encodedSearchName = encodeURIComponent(searchName);

  const { lat, lng } = CONFIG.wedding;

  if (mapLink) {
    mapLink.href =
      `https://map.naver.com/p/search/${encodedSearchName}`;
  }

  if (directionLink) {

    directionLink.href =
  
      "https://map.naver.com/p/directions/-/3zlvyM,2AKTV8,%EA%B9%8C%EC%82%AC%EA%B7%B8%EB%9E%91%EB%8D%B0%20%EC%84%BC%ED%8A%B8%EB%A1%9C,1396499968,PLACE_POI/-/transit?c=15.00,0,0,0,dh";
  
  }

  if (
    !NAVER_MAP_CLIENT_ID ||
    !mapElement ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return;
  }

  const createMap = () => {
    const position =
      new window.naver.maps.LatLng(lat, lng);

    const map =
      new window.naver.maps.Map("naverMap", {
        center: position,
        zoom: 17,
        zoomControl: true,
        zoomControlOptions: {
          position:
            window.naver.maps.Position.TOP_RIGHT
        }
      });

    const marker =
      new window.naver.maps.Marker({
        position,
        map,
        title: searchName
      });

    window.naver.maps.Event.addListener(
      marker,
      "click",
      () => {
        window.open(
          mapLink.href,
          "_blank",
          "noopener,noreferrer"
        );
      }
    );
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
    mapElement.innerHTML = `
      <p class="map-error">
        지도를 불러오지 못했습니다.<br />
        아래 버튼을 이용해 주세요.
      </p>
    `;
  };

  document.head.appendChild(script);
}

function initKakaoShare() {
  const button = $("#kakaoShareBtn");

  if (!button || !KAKAO_SDK_JS_KEY) return;

  const initialize = () => {
    if (
      window.Kakao &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init(KAKAO_SDK_JS_KEY);
    }
  };

  if (!window.Kakao) {
    const script =
      document.createElement("script");

    script.src =
      "https://developers.kakao.com/sdk/js/kakao.js";

    script.async = true;
    script.onload = initialize;
    document.head.appendChild(script);
  } else {
    initialize();
  }

  button.addEventListener("click", () => {
    if (!window.Kakao?.isInitialized()) {
      alert("카카오 공유 기능을 준비하고 있습니다.");
      return;
    }
  
    const descriptionWithUrl = [
      CONFIG.share.description,
      CONFIG.share.linkUrl
    ].join("\n");
  
    const locationUrl = new URL(CONFIG.share.linkUrl);
    locationUrl.hash = "location";
  
    window.Kakao.Share.sendDefault({
      objectType: "feed",
  
      content: {
        title: CONFIG.share.title,
        description: descriptionWithUrl,
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
  const button = $("#nativeShareBtn");

  if (!button) return;

  button.addEventListener("click", async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: CONFIG.share.title,
          text: CONFIG.share.description,
          url: CONFIG.share.linkUrl
        });

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

let musicAudio = null;
let musicButton = null;
let musicPlaying = false;

async function tryPlayMusic() {
  if (!musicAudio || !musicButton) return;

  try {
    await musicAudio.play();
    musicPlaying = true;
    syncMusicButton();
  } catch {
    musicPlaying = false;
    syncMusicButton();
  }
}

function syncMusicButton() {
  if (!musicButton) return;

  musicButton.classList.toggle(
    "playing",
    musicPlaying
  );

  musicButton.textContent =
    musicPlaying ? "Ⅱ" : "♪";

  musicButton.setAttribute(
    "aria-label",
    musicPlaying
      ? "배경음악 일시정지"
      : "배경음악 재생"
  );
}

function initMusic() {
  musicAudio = $("#weddingBgm");
  musicButton = $("#musicToggleBtn");

  if (
    !musicAudio ||
    !musicButton ||
    !CONFIG.music?.src
  ) {
    return;
  }

  musicAudio.src = CONFIG.music.src;
  musicAudio.volume = CONFIG.music.volume;

  musicButton.addEventListener(
    "click",
    async event => {
      event.stopPropagation();

      if (musicPlaying) {
        musicAudio.pause();
        musicPlaying = false;
        syncMusicButton();
      } else {
        await tryPlayMusic();
      }
    }
  );

  musicAudio.addEventListener("play", () => {
    musicPlaying = true;
    syncMusicButton();
  });

  musicAudio.addEventListener("pause", () => {
    musicPlaying = false;
    syncMusicButton();
  });

  musicAudio.addEventListener("error", () => {
    musicButton.hidden = true;
  });
}

init();
