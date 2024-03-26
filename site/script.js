import { Howl } from "howler";
import { Splide } from "@splidejs/splide";

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
  if (state.currentChannelSfx) {
    state.currentChannelSfx.stop();
    state.currentChannelSfx = null;
  }

  const idx = parseInt(e.target.dataset.channelIdx);

  if (state.channelCarousel.index === idx) {
    if ("sfxIdx" in e.target.dataset) {
      const sfxIdx = parseInt(e.target.dataset.sfxIdx);

      if (state.channelSfx[sfxIdx].state() === "loaded") {
        setTimeout(() => {
          state.channelSfx[sfxIdx].play();
        }, 500);
      }
    }
  }

  const startBtn = document.getElementById("start-btn-link");
  if ("url" in e.target.dataset) {
    startBtn.href = e.target.dataset.url;
  } else {
    startBtn.href = "#";
  }

  state.channelCarousel.go(idx);

  if (state.channelClickSfx.state() === "loaded") state.channelClickSfx.play();
  if (state.channelOpenSfx.state() === "loaded") state.channelOpenSfx.play();

  const elemCenter = state.transformOrigins[idx];

  state.topSection.style.transformOrigin = `${elemCenter.x}px ${elemCenter.y}px`;
  state.frame.classList.remove("pointer-events-none");
  state.topSection.classList.add("expanded");
  state.frame.classList.remove("o-0");
}

const closeChannelCarousel = () => {
  // Clear focus from the menu button to prevent the sound effect from playing
  // while the channel carousel is hidden
  document.activeElement?.blur && document.activeElement.blur();

  if (state.currentChannelSfx) {
    state.currentChannelSfx.stop();
    state.currentChannelSfx = null;
  }

  // play sfx
  if (state.channelClickSfx.state() === "loaded") state.channelClickSfx.play();
  if (state.channelCloseSfx.state() === "loaded") state.channelCloseSfx.play();

  // get the center of the element
  const elemCenter = state.transformOrigins[state.channelCarousel.index];

  state.topSection.style.transformOrigin = `${elemCenter.x}px ${elemCenter.y}px`;
  state.frame.classList.add("pointer-events-none");
  state.topSection.classList.remove("expanded");

  state.frame.classList.add("o-0");
};

const state = {
  channelCarousel: null,
  hoverClickSfx: null,
  channelClickSfx: null,
  channelOpenSfx: null,
  channelCloseSfx: null,
  dingSfx: null,
  diskChannelSfx: null,
  shopChannelSfx: null,
  checkMiiOutChannelSfx: null,
  internetChannelSfx: null,
  channelSfx: [],
  transformOrigins: [],
  mainMenu: null,
  frame: null,
  currentChannelSfx: null,
  topSection: null,
};

const init = () => {
  // Init the sfx
  state.hoverClickSfx = new Howl({
    src: ["https://files.catbox.moe/0dwdsb.mp3"],
    volume: 0.3,
  });
  state.channelClickSfx = new Howl({
    src: ["https://files.catbox.moe/oghwju.mp3"],
    volume: 0.3,
  });
  state.channelOpenSfx = new Howl({
    src: ["https://files.catbox.moe/i8e9d4.mp3"],
    volume: 0.3,
  });
  state.channelCloseSfx = new Howl({
    src: ["https://files.catbox.moe/xtru8e.mp3"],
    volume: 0.25,
  });
  state.dingSfx = new Howl({
    src: ["https://files.catbox.moe/tr0usf.mp3"],
    volume: 0.3,
  });

  state.channelCarousel = new Splide(".splide", {
    type: "loop",
    speed: 0,
    rewindSpeed: 0,
    drag: false,
  }).mount();

  // channel carousel sfx

  state.diskChannelSfx = new Howl({
    src: ["https://files.catbox.moe/g6epxj.mp3"],
    volume: 0.5,
    html5: true,
    onplay: () => {
      state.currentChannelSfx = state.diskChannelSfx;
    },
    onstop: () => {
      state.currentChannelSfx = null;
    },
  });

  state.checkMiiOutChannelSfx = new Howl({
    src: ["https://files.catbox.moe/6quqqw.mp3"],
    volume: 0.3,
    html5: true,
    onplay: () => {
      state.currentChannelSfx = state.checkMiiOutChannelSfx;
    },
    onstop: () => {
      state.currentChannelSfx = null;
    },
  });

  state.shopChannelSfx = new Howl({
    src: ["https://files.catbox.moe/n21ygc.mp3"],
    volume: 0.3,
    html5: true,
    onplay: () => {
      state.currentChannelSfx = state.shopChannelSfx;
    },
    onstop: () => {
      state.currentChannelSfx = null;
    },
  });

  state.internetChannelSfx = new Howl({
    src: ["https://files.catbox.moe/u1xg3j.mp3"],
    volume: 0.3,
    html5: true,
    onplay: () => {
      state.currentChannelSfx = state.internetChannelSfx;
    },
    onstop: () => {
      state.currentChannelSfx = null;
    },
  });

  state.channelSfx = [
    state.diskChannelSfx,
    state.checkMiiOutChannelSfx,
    state.shopChannelSfx,
    state.internetChannelSfx,
  ];

  // Add the channels to the carousel
  document.querySelectorAll(".channel-inner-container").forEach((element) => {
    const newElem = document.createElement("li");
    newElem.classList.add("splide__slide");

    const elemClone = element.cloneNode(true);
    elemClone.classList.add("channel-expanded");
    newElem.appendChild(elemClone);

    state.channelCarousel.add(newElem);
  });

  // Add event handlers to all the channels
  state.mainMenu = document.querySelector(".main-menu");
  state.frame = document.querySelector(".frame");
  state.topSection = document.querySelector(".top-section");

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
      if (state.hoverClickSfx.state() === "loaded") state.hoverClickSfx.play();
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
      if (state.hoverClickSfx.state() === "loaded") state.hoverClickSfx.play();
    });

    element.addEventListener("click", function (e) {
      if (state.dingSfx.state() === "loaded") state.dingSfx.play();
    });
  });

  // Add sound effects to the carousel buttons
  document.querySelectorAll(".splide__arrow").forEach((element) => {
    element.addEventListener("mouseover", function (e) {
      if (state.hoverClickSfx.state() === "loaded") state.hoverClickSfx.play();
    });

    element.addEventListener("click", function (e) {
      if (state.channelClickSfx.state() === "loaded")
        state.channelClickSfx.play();
    });
  });

  // Play sound effects if specified by channel
  state.channelCarousel.on("move", (newIdx) => {
    const next = document.querySelector(
      ".channel[data-channel-idx='" + newIdx + "']",
    );

    if (state.currentChannelSfx) state.currentChannelSfx.stop();

    const startBtn = document.getElementById("start-btn-link");
    if ("url" in next.dataset) {
      startBtn.href = next.dataset.url;
    } else {
      startBtn.href = "#";
    }

    if (
      next.dataset.sfxIdx >= 0 &&
      next.dataset.sfxIdx < state.channelSfx.length
    ) {
      setTimeout(() => {
        if (state.channelSfx[next.dataset.sfxIdx].state() === "loaded") {
          state.channelSfx[next.dataset.sfxIdx].play();
        }
      }, 500);
    }
  });
};

window.WiiMenuJS = {
  closeChannelCarousel,
  formatDate,
  init,
};
