import { useSfx } from "./useSfx.js";
import { useCarousel } from "./useCarousel.js";
import { calculateTransformOrigins, formatDate } from "./util.js";

// hooks
const [genSfx, channelSfx] = useSfx();
const carousel = useCarousel(".splide", ".channel-inner-container");

// element references
const frame = document.getElementById("frame");
const startBtnLink = document.getElementById("start-btn-link");
const topSection = document.querySelector(".top-section");

// used for css transform
const transformOrigins = calculateTransformOrigins(".channel");

// setup date label
document.getElementById("date-label").textContent = formatDate();

// Setup hover sfx
document.querySelectorAll("[data-hover-sfx]").forEach((elem) => {
  elem.addEventListener("mouseenter", () => {
    genSfx.playSound(elem.dataset.hoverSfx);
  });
});

// Setup click sfx
document.querySelectorAll("[data-click-sfx]").forEach((elem) => {
  elem.addEventListener("click", () => {
    genSfx.playSound(elem.dataset.clickSfx);
  });
});

// Setup carousel events
carousel.on("move", (newIdx) => {
  // Stop channel sfx
  channelSfx.stop();

  // Set transform origin to the center of the new element
  const elemCenter = transformOrigins[newIdx];
  topSection.style.transformOrigin = `${elemCenter.x}px ${elemCenter.y}px`;

  // play channel sfx if specified
  const channel = document.querySelector(
    `.channel.occupied[data-channel-idx="${newIdx}"]`,
  );
  if ("channelSfx" in channel.dataset) {
    setTimeout(() => {
      channelSfx.playSound(channel.dataset.channelSfx);
    }, 500);
  }

  if ("url" in channel.dataset) {
    startBtnLink.href = channel.dataset.url;
  } else {
    startBtnLink.href = "#";
  }
});

// Setup channel click events
document.querySelectorAll(".channel.occupied").forEach((channel) => {
  channel.addEventListener("click", () => {
    const idx = parseInt(channel.dataset.channelIdx);

    // play channel sfx if specified
    // if moving to another channel, the sfx will be triggered in the carousel move event
    if (carousel.index === idx && "channelSfx" in channel.dataset) {
      setTimeout(() => {
        channelSfx.playSound(channel.dataset.channelSfx);
      }, 500);
    }

    carousel.go(idx);

    // set the start button link destination
    if ("url" in channel.dataset) {
      startBtnLink.href = channel.dataset.url;
    } else {
      startBtnLink.href = "#";
    }

    // get the center of the element
    const elemCenter = transformOrigins[idx];

    topSection.style.transformOrigin = `${elemCenter.x}px ${elemCenter.y}px`;
    frame.classList.remove("pointer-events-none");
    topSection.classList.add("expanded");

    frame.classList.remove("o-0");
  });
});

// Setup Cue Menu button (close carousel)
document.querySelector(".menu-button").addEventListener("click", (e) => {
  // "unfocus" the button if necessary
  document.activeElement?.blur && document.activeElement.blur();

  // Stop playing any sounds
  channelSfx.stop();

  const elemCenter = transformOrigins[carousel.index];

  topSection.style.transformOrigin = `${elemCenter.x}px ${elemCenter.y}px`;
  frame.classList.add("pointer-events-none");
  topSection.classList.remove("expanded");

  frame.classList.add("o-0");
});
