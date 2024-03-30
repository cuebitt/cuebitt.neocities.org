import { Splide } from "@splidejs/splide";

/**
 * Carousel hook. Initializes the Splide carousel from the channel inner containers
 * @param {string} carouselSelector
 * @param {string} channelInnerSelector
 * @returns {any}
 */
const useCarousel = (carouselSelector, channelInnerSelector) => {
  const channelCarousel = new Splide(carouselSelector, {
    type: "loop",
    speed: 0,
    rewindSpeed: 0,
    drag: false,
  }).mount();

  // Add the channels to the carousel
  document.querySelectorAll(channelInnerSelector).forEach((element) => {
    const newElem = document.createElement("li");
    newElem.classList.add("splide__slide");

    const elemClone = element.cloneNode(true);
    elemClone.classList.add("channel-expanded");
    newElem.appendChild(elemClone);

    channelCarousel.add(newElem);
  });

  // Wrapper fn used to emit the active and move event when moving to
  // the current slide
  channelCarousel.goWrapper = (idx) => {
    if (channelCarousel.index === idx) {
      channelCarousel.emit(
        "active",
        channelCarousel.Components.Slides.getAt(idx),
      );
      channelCarousel.emit("move", idx, idx, idx);
    } else {
      channelCarousel.go(idx);
    }
  };

  return channelCarousel;
};

export { useCarousel };
