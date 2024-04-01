class AboutChannelMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._template = null;
    this._css = null;
    this._element = null;
    this._connected = false;

    this._imgSrc = null;
  }

  connectedCallback() {
    this._imgSrc = this.getAttribute("img-src") || "";

    this._css = new CSSStyleSheet();
    this._css.replaceSync(AboutChannelMenu.styles());

    this._template = document.createElement("template");
    this._template.innerHTML = AboutChannelMenu.template();

    this.render();
    this._connected = true;
  }

  static get observedAttributes() {
    return ["img-src"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._connected || oldVal === newVal) return;

    switch (name) {
      case "img-src":
        this._imgSrc = newVal;
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

    this._element = this.shadowRoot.querySelector(".outer-container");
  }

  static template() {
    return /* html */ `
<div class="outer-container">
        <div class="main-text">
          <h1>Info</h1>
          <p>&</p>
          <h1>Social Links</h1>
        </div>
        <div class="cd-background-container">
          <div class="reflector-src">
            <div class="reflect dvd bg-dvd">
              <div class="dvd-inner"></div>
            </div>
          </div>

          <div class="reflector">
            <div class="reflect dvd bg-dvd">
              <div class="dvd-inner"></div>
            </div>
          </div>
        </div>
      </div>
`;
  }

  static styles() {
    return /* css */ `
      @keyframes dvd-spin {
        0% {
          transform: rotateY(0deg);
        }
        50%,
        100% {
          transform: rotateY(-360deg);
        }
      }

      .reflect {
        animation-name: dvd-spin;
        animation-duration: 10s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-out;
      }

      .main-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        gap: 0.5em;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p {
        margin: 0;
        padding: 0;
        text-align: center;
        vertical-align: middle;
      }

      .main-text {
        position: relative;
      }

      .cd-background-container {
        position: absolute;
        top: 0;
        left: 0;

        z-index: -1;
        opacity: 50%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .bg-dvd {
        --w: 7em;
        --h: 7em;
        --bg-color: #dfcbfa;
      }

      .outer-container {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .reflect-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .reflector-src {
        padding: 0.5em;
      }

      .reflector {
        padding: 0.5em;
        transform: rotateX(180deg);
        mask-image: linear-gradient(
          transparent 40%,
          rgba(255, 255, 255, 0.5) 90%
        );
        overflow: visible;
      }

      .dvd {
        position: relative;
        width: var(--w);
        height: var(--h);
        overflow: hidden;
        border-radius: 50%;
        border: 2px solid #ffcf33;
        outline: 2px solid var(--bg-color);
      }

      .dvd:after {
        content: "";
        position: absolute;
        transform-origin: center;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border-radius: 100%;
        width: calc(var(--w) / 5);
        height: calc(var(--h) / 5);
        box-shadow: 0px 0px 0px 2000px var(--bg-color);
        z-index: -1;
        border: 2px solid var(--bg-color);
        outline: 2px solid white;
      }

      .dvd-shadow {
        background: rgb(0, 0, 0);
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.15) 25%,
          rgba(0, 0, 0, 0.15) 75%,
          rgba(0, 0, 0, 0) 100%
        );
        border-radius: 50%;
        margin: 0.25em 1.5em;
        height: 0.25em;
      }
    `;
  }
}

window.customElements.define("about-channel-menu", AboutChannelMenu);
