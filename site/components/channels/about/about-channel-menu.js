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
    this._css.replaceSync(this.styles());

    this._template = document.createElement("template");
    this._template.innerHTML = this.template();

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

  template() {
    return /* html */ `
<div class="outer-container">

</div>
`;
  }

  styles() {
    return /* css */ `
  
  
  .outer-container {
    position: relative;
    display: flex;
    justify-content: center;
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
    mask-image: linear-gradient(transparent 40%, rgba(255, 255, 255, 0.5) 90%);
    overflow: visible;
  }
  
  .dvd {
    position: relative;
    width: var(--w);
    height: var(--h);
    overflow: hidden;
    border-radius: 50%;
    border: 2px solid white;
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
  
  .dvd-inner {
    display: flex;
    height: 100%;
    justify-content: left;
    align-items: center;
    padding: 0.1em;
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
