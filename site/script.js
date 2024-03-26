import { Howl } from "https://cdn.jsdelivr.net/npm/howler@2.2.4/+esm";
import { Splide } from "https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/+esm";

const formatDate = () => {
  // Get the current date
  const currentDate = new Date();

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    currentDate.getDay()
  ];

  // Construct the formatted string
  return `${dayOfWeek} ${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
};

function offset(element) {
  if (!element.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  const rect = element.getBoundingClientRect();
  const win = element.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  };
}

function onChannelClick(e) {
  const idx = parseInt(e.target.getAttribute("data-channel-idx"));

  state.channelCarousel.go(idx);

  if (state.channelClickSfxReady) state.channelClickSfx.play();
  if (state.channelOpenSfxReady) state.channelOpenSfx.play();

  const elemCenter = state.transformOrigins[idx];

  state.mainMenu.style.transformOrigin = `${elemCenter.x}px ${elemCenter.y}px`;
  state.mainMenu.classList.toggle("expanded");
  state.mainMenu.classList.toggle("pointer-events-none");
  state.frame.classList.toggle("o-0");
}

const closeChannelCarousel = () => {
  // play sfx
  if (state.channelClickSfxReady) state.channelClickSfx.play();
  if (state.channelCloseSfxReady) state.channelCloseSfx.play();

  // get the center of the element
  const elemCenter = state.transformOrigins[state.channelCarousel.index];
  state.mainMenu.style.transformOrigin = `${elemCenter.x}px ${elemCenter.y}px`;

  state.mainMenu.classList.remove("expanded");
  state.mainMenu.classList.remove("pointer-events-none");
  state.frame.classList.add("o-0");
};

const state = {
  channelCarousel: null,
  hoverClickSfx: null,
  channelClickSfx: null,
  channelOpenSfx: null,
  channelCloseSfx: null,
  dingSfx: null,
  transformOrigins: [],
  hoverClickSfxReady: false,
  channelClickSfxReady: false,
  channelOpenSfxReady: false,
  channelCloseSfxReady: false,
  dingSfxReady: false,
  mainMenu: null,
  frame: null,
};

const init = () => {
  // Init the sfx
  state.hoverClickSfxReady = false;
  state.hoverClickSfx = new Howl({
    src: ["https://files.catbox.moe/0dwdsb.mp3"],
    volume: 0.3,
    onload: () => {
      state.hoverClickSfxReady = true;
    },
  });
  state.channelClickSfxReady = false;
  state.channelClickSfx = new Howl({
    src: ["https://files.catbox.moe/oghwju.mp3"],
    volume: 0.3,
    onload: () => {
      state.channelClickSfxReady = true;
    },
  });
  state.channelOpenSfxReady = false;
  state.channelOpenSfx = new Howl({
    src: ["https://files.catbox.moe/i8e9d4.mp3"],
    volume: 0.3,
    onload: () => {
      state.channelOpenSfxReady = true;
    },
  });
  state.channelCloseSfxReady = false;
  state.channelCloseSfx = new Howl({
    src: ["https://files.catbox.moe/xtru8e.mp3"],
    volume: 0.25,
    onload: () => {
      state.channelCloseSfxReady = true;
    },
  });
  state.dingSfxReady = false;
  state.dingSfx = new Howl({
    src: ["https://files.catbox.moe/tr0usf.mp3"],
    volume: 0.3,
    onload: () => {
      state.dingSfxReady = true;
    },
  });

  state.channelCarousel = new Splide(".splide", {
    type: "loop",
    speed: 0,
    rewindSpeed: 0,
    drag: false,
  }).mount();

  // Add the channels to the carousel
  document.querySelectorAll(".channel-inner-container").forEach((element) => {
    const newElem = document.createElement("li");
    newElem.classList.add("splide__slide");
    newElem.appendChild(element.cloneNode(true));

    state.channelCarousel.add(newElem);
  });

  // Add event handlers to all the channels
  state.mainMenu = document.querySelector(".main-menu");
  state.frame = document.querySelector(".frame");

  // Transform origins for each channel used to zoom in and out
  state.transformOrigins = new Array(12);

  // Add event handlers to the occupied channels
  document.querySelectorAll(".channel.occupied").forEach((element, idx) => {
    // Maximize the channel on click
    element.addEventListener("click", function (e) {
      onChannelClick(e);
    });

    // hover sfx
    element.addEventListener("mouseover", (e) => {
      if (state.hoverClickSfxReady) state.hoverClickSfx.play();
    });

    // store the transform origin
    const elemRect = element.getBoundingClientRect();
    const elemOffset = offset(element);

    const elemCenter = {
      x: elemOffset.left + elemRect.width / 2.0,
      y: elemOffset.top + elemRect.height / 2.0,
    };

    state.transformOrigins[idx] = elemCenter;
  });

  // Add event handlers to the bottom buttons
  document.querySelectorAll(".bottom-btn").forEach((element) => {
    element.addEventListener("mouseover", function (e) {
      if (state.hoverClickSfxReady) state.hoverClickSfx.play();
    });

    element.addEventListener("click", function (e) {
      if (state.dingSfxReady) state.dingSfx.play();
    });
  });

  // Add sound effects to the carousel buttons
  document.querySelectorAll(".splide__arrow").forEach((element) => {
    element.addEventListener("mouseover", function (e) {
      if (state.hoverClickSfxReady) state.hoverClickSfx.play();
    });

    element.addEventListener("click", function (e) {
      if (state.channelClickSfxReady) state.channelClickSfx.play();
    });
  });
};

window.WiiMenuJS = {
  closeChannelCarousel,
  formatDate,
  init,
};
