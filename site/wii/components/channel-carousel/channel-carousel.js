import { Splide } from "https://esm.sh/@splidejs/splide@4.1.4";

class ChannelCarousel extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this._template = null;
    this._css = null;
    this._element = null;
    this._connected = false;

    // internal references
    this._carousel = null;

    // attributes
    this._channelsSelector = null;
  }

  connectedCallback() {
    this._channelsSelector = this.getAttribute("channels-selector") || "";

    this._css = new CSSStyleSheet();
    this._css.replaceSync(ChannelCarousel.styles());

    this._template = document.createElement("template");
    this._template.innerHTML = ChannelCarousel.template();

    document.addEventListener(
      "DOMContentLoaded",
      () => {
        this.render();
        this._connected = true;
      },
      false,
    );
  }

  static get observedAttributes() {
    return ["channels-selector"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._connected || oldVal === newVal) return;

    switch (name) {
      case "channels-selector":
        this._channelsSelector = newVal;
        break;
      default:
        return;
    }

    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = "";

    this.shadowRoot.adoptedStyleSheets = [this._css];
    this.shadowRoot.appendChild(this._template.content.cloneNode(true));

    this._element = this.shadowRoot.querySelector(".splide");

    // Create the Splide carousel instance
    if (this._carousel) this._carousel.destroy(true);
    this._carousel = new Splide(this._element, {
      type: "loop",
      speed: 0,
      rewindSpeed: 0,
      drag: false,
    }).mount();

    if (this._channelsSelector !== "") {
      // Add the channels to the carousel
      document.querySelectorAll(this._channelsSelector).forEach((element) => {
        const newElem = document.createElement("li");
        newElem.classList.add("splide__slide");

        const elemClone = element.cloneNode(true);
        elemClone.querySelector(".channel-menu-container").style.display =
          "none";
        newElem.appendChild(elemClone);

        this._carousel.add(newElem);
      });
    }

    // Setup events
    this._carousel.on("move", (newIdx, prevIdx, destIdx) => {
      const moveEvent = new CustomEvent("move", {
        detail: {
          newIdx,
          prevIdx,
          destIdx,
        },
        bubbles: true,
        composed: true,
      });

      this.dispatchEvent(moveEvent);
    });

    this._carousel.on("inactive", (slide) => {
      const inactiveEvent = new CustomEvent("inactive", {
        detail: {
          slide,
        },
        bubbles: true,
        composed: true,
      });

      this.dispatchEvent(inactiveEvent);
    });

    this._carousel.on("active", (slide) => {
      const activeEvent = new CustomEvent("active", {
        detail: {
          slide,
        },
        bubbles: true,
        composed: true,
      });

      this.dispatchEvent(activeEvent);
    });

    // Emit events for external sfx on arrow click and hover
    this._element.querySelectorAll(".splide__arrow").forEach((arrow) => {
      arrow.addEventListener("click", () => {
        const arrowEvent = new CustomEvent("arrowclick", {
          detail: {
            direction: arrow.classList.contains("splide__arrow--prev")
              ? "prev"
              : "next",
          },
          bubbles: true,
          composed: true,
        });

        this.dispatchEvent(arrowEvent);
      });

      arrow.addEventListener("mouseover", () => {
        const arrowEvent = new CustomEvent("arrowhover", {
          detail: {
            direction: arrow.classList.contains("splide__arrow--prev")
              ? "prev"
              : "next",
          },
          bubbles: true,
          composed: true,
        });

        this.dispatchEvent(arrowEvent);
      });
    });
  }

  goToSlide(idx) {
    if (!this._connected || !this._carousel) return;

    // Emit an active event even if moving to the same slide
    if (this._carousel.index === idx) {
      this._carousel.emit(
        "active",
        this._carousel.Components.Slides.getAt(idx),
      );
      this._carousel.emit("move", idx, idx, idx);
    } else {
      this._carousel.go(idx);
    }
  }

  get index() {
    return this._carousel.index;
  }

  static template() {
    return /* html */ `
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css"
      />

      <section
        class="splide channel-carousel"
        aria-label="Channel Picker Carousel"
      >
        <div class="splide__arrows channel-carousel-arrows">
          <button class="splide__arrow splide__arrow--prev arrow-l"></button>
          <button class="splide__arrow splide__arrow--next arrow-r"></button>
        </div>

        <div class="splide__track">
          <ul class="splide__list" id="carousel-list"></ul>
        </div>
      </section>
`;
  }

  static styles() {
    return /* css */ `
      .channel-carousel,
      .splide__track,
      .splide__list {
        height: 100%;
        flex: 0 0 80%;
      }

      .channel-carousel {
        background-color: white;
      }

      .splide__slide {
        height: 100%;
      }

      .splide__pagination.splide__pagination--ltr {
        display: none;
      }

      .channel-carousel-arrows > .splide__arrow {
        background-color: transparent !important;
        opacity: 1 !important;
        border-radius: 0 !important;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        height: 3rem;
        transition: transform 0.1s;
        transform: translateY(-50%);
      }

      .channel-carousel-arrows > .splide__arrow:hover {
        transform: translateY(-50%) scale(1.1);
      }

      .channel-carousel-arrows > .splide__arrow--prev {
        margin-left: -0.5rem;
        background-image: url("/assets/index/img/arrow-l.svg");
      }

      .channel-carousel-arrows > .splide__arrow--next {
        margin-right: -0.5rem;
        background-image: url("/assets/index/img/arrow-r.svg");
      }
    `;
  }
}

window.customElements.define("channel-carousel", ChannelCarousel);
