import { useSfx } from "./useSfx.js";
import { calculateTransformOrigins, formatDate } from "./util.js";

// hooks
const [genSfx, channelSfx] = useSfx();
const carousel = document.getElementById("channel-carousel");
let carouselIsOpen = false;

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

carousel.addEventListener("move", (e) => {
  // Stop channel sfx
  channelSfx.stop();

  // Set transform origin to the center of the new element
  const elemCenter = transformOrigins[e.detail.newIdx];
  topSection.style.transformOrigin = `${elemCenter.x}px ${elemCenter.y}px`;

  // play channel sfx if specified
  const channel = document.querySelector(
    `.channel.occupied[data-channel-idx="${e.detail.newIdx}"]`,
  );

  // Delay the sfx until after the transition of the carousel is not open
  if ("channelSfx" in channel.dataset) {
    const delay = carouselIsOpen ? 0 : 500;

    setTimeout(() => {
      channelSfx.stop();
      channelSfx.playSound(channel.dataset.channelSfx);
    }, delay);
  }

  // Update the link button
  if ("url" in channel.dataset) {
    startBtnLink.href = channel.dataset.url;
  } else {
    startBtnLink.href = "#";
  }
});

carousel.addEventListener("inactive", (e) => {
  if (e.detail.isClone) return;

  try {
    e.detail.slide.slide
      .querySelector(
        ".channel-inner-container > .channel-carousel-container > *:first-child",
      )
      .deactivateChannel();
  } catch (err) {
    console.error(err);
  }
});

carousel.addEventListener("active", (e) => {
  if (e.detail.isClone) return;

  try {
    const currSlide = e.detail.slide.slide.querySelector(
      ".channel-inner-container > .channel-carousel-container > *:first-child",
    );

    // Deactivate it just in case
    currSlide.deactivateChannel();

    // Activate after transition if the carousel isn't open yet
    const delay = carouselIsOpen ? 1 : 500;
    setTimeout(() => {
      currSlide.activateChannel();
    }, delay);
  } catch (err) {
    console.error(err);
  }
});

// Setup channel click events
document.querySelectorAll(".channel.occupied").forEach((channel) => {
  channel.addEventListener("click", () => {
    const idx = parseInt(channel.dataset.channelIdx);

    // play channel sfx if specified
    // if moving to another channel, the sfx will be triggered in the carousel move event
    carousel.goToSlide(idx);

    // set the start button link destination
    if ("url" in channel.dataset) {
      startBtnLink.href = channel.dataset.url;
    } else {
      startBtnLink.href = "#";
    }

    // Set the transform origin and open the carousel
    const elemCenter = transformOrigins[idx];

    topSection.style.transformOrigin = `${elemCenter.x}px ${elemCenter.y}px`;
    frame.classList.remove("pointer-events-none");
    topSection.classList.add("expanded");

    frame.classList.remove("o-0");

    carouselIsOpen = true;
  });
});

// Setup Cue Menu button (close carousel)
document.querySelector(".menu-button").addEventListener("click", (e) => {
  // "unfocus" the button if necessary
  document.activeElement?.blur && document.activeElement.blur();

  // Stop playing any sounds
  channelSfx.stop();

  // Set the transform origin and close the carousel
  const elemCenter = transformOrigins[carousel.index];

  topSection.style.transformOrigin = `${elemCenter.x}px ${elemCenter.y}px`;
  frame.classList.add("pointer-events-none");
  topSection.classList.remove("expanded");

  frame.classList.add("o-0");

  carouselIsOpen = false;
});
