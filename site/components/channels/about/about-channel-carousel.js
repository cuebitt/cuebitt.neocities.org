class AboutChannelCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._template = null;
    this._css = null;
    this._element = null;
    this._connected = false;

    this._smallImgSrc = null;
  }

  connectedCallback() {
    this._smallImgSrc = this.getAttribute("small-img-src") || "";

    this._css = new CSSStyleSheet();
    this._css.replaceSync(AboutChannelCarousel.styles());

    this._template = document.createElement("template");
    this._template.innerHTML = AboutChannelCarousel.template();

    this.render();
    this._connected = true;
  }

  static get observedAttributes() {
    return ["small-img-src"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._connected || oldVal === newVal) return;

    switch (name) {
      case "small-img-src":
        this._smallImgSrc = newVal;
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

  activateChannel() {
    this._element.classList.add("animate");
  }

  deactivateChannel() {
    this._element.classList.remove("animate");
  }

  static template() {
    return /* html */ `
    <div class="outer-container">
<div class="reflect-container-grid">
  <div class="reflector-src">
    <div class="reflect dvd big-dvd">
      <div class="dvd-inner">
        <p>Links</p>
        <p>Info</p>
      </div>
    </div>
  </div>

  <div class="small-dvd-container">
    <div class="reflector-src">
      <div class="reflect dvd small-dvd">
        <div class="dvd-inner">
          <div class="top" style="background-image: url(${this._smallImgSrc})"></div>
          <div class="bottom">
            <p>Cuebitt</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="dvd-shadow"></div>
  <div class="dvd-shadow"></div>

  <div class="reflector">
    <div class="reflect dvd big-dvd">
      <div class="dvd-inner">
        <p>Links</p>
        <p>Info</p>
      </div>
    </div>
  </div>

  <div class="small-dvd-container" style="justify-content: start;">
    <div class="reflector">
      <div class="reflect dvd small-dvd">
        <div class="dvd-inner">
          <div class="top" style="background-image: url(${this._smallImgSrc})"></div>
          <div class="bottom">
            <p>Cuebitt</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
        `;
  }

  static styles() {
    return /* css */ `
.reflect-container-grid {
  display: grid;
  grid-template-columns: 21em 15em;
  grid-template-rows: auto 0.75em auto;
  column-gap: 5em;
  width: fit-content;
  height: 21em;
  transform: translateY(30%);
}

.outer-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.outer-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150"><path d="M-4.788-1.755v11.931l152.706.133c26.236.054 26.59.06 28.605.416 6.745 1.195 11.854 3.722 17.58 8.694l3.293 2.862c2.058 1.792 5.233 3.993 7.473 5.181 4.435 2.353 8.779 3.542 14.662 4.013 1.56.125 60.188-.02 85.666-.022l.03-33.147z" style="fill:%232cafee;fill-opacity:1;stroke:%23686868;stroke-width:.489669;stroke-dasharray:none;stroke-opacity:1"/></svg>');
  background-size: cover;
  background-repeat: no-repeat;
}

.outer-container::after {
  content: "Links & Info Channel";
  position: absolute;
  top: 35%;
  right: 4%;
  width: 100%;
  height: 100%;

  text-align: end;
  font-size: 2.5vw;
  font-weight: bold;
  color: white;
  text-shadow: rgb(0, 0, 0) 2px 0px 0px, rgb(0, 0, 0) 1.755165px 0.958851px 0px, rgb(0, 0, 0) 1.080605px 1.682942px 0px, rgb(0, 0, 0) 0.141474px 1.99499px 0px, rgb(0, 0, 0) -0.832294px 1.818595px 0px, rgb(0, 0, 0) -1.602287px 1.196944px 0px, rgb(0, 0, 0) -1.979985px 0.28224px 0px, rgb(0, 0, 0) -1.872913px -0.701566px 0px, rgb(0, 0, 0) -1.307287px -1.513605px 0px, rgb(0, 0, 0) -0.421592px -1.95506px 0px, rgb(0, 0, 0) 0.567324px -1.917849px 0px, rgb(0, 0, 0) 1.41734px -1.411081px 0px, rgb(0, 0, 0) 1.920341px -0.558831px 0px;
}

.outer-container::before,
.outer-container::after {
  transition: transform 0.5s ease-out;
  transform: translateY(-50%);
}

.outer-container.animate::before,
.outer-container.animate::after {
  
  transform: translateY(0%);
}

.outer-container > .reflect-container-grid {
  opacity: 0;
}

.outer-container.animate > .reflect-container-grid {
  transition: opacity 0.5s linear;
  opacity: 100%;
}

.outer-container > .reflect-container-grid > .reflector-src > .reflect,
.outer-container > .reflect-container-grid > .reflector > .reflect,
.outer-container > .reflect-container-grid > div > .reflector-src > .reflect,
.outer-container > .reflect-container-grid > div > .reflector > .reflect {
  transform: rotate(0deg);

}

.outer-container.animate > .reflect-container-grid > .reflector-src > .reflect,
.outer-container.animate > .reflect-container-grid > .reflector > .reflect,
.outer-container.animate > .reflect-container-grid > div > .reflector-src > .reflect,
.outer-container.animate > .reflect-container-grid > div > .reflector > .reflect {
  transition: transform 1.5s ease-out, opacity 1.5s ease-out;
  transform: rotate(-360deg);
 
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

.big-dvd {
  --w: 20em;
  --h: 20em;
  --bg-color: #64c6fb;
}

.big-dvd > .dvd-inner {
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  font-weight: bold;
  color: white;
  font-size: 4em;
}

.big-dvd > .dvd-inner > p {
  margin: 0;
  padding: 0;
}

.small-dvd-container {
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.small-dvd {
  --w: 14em;
  --h: 14em;
  --bg-color: #496598;
}

.small-dvd > .dvd-inner {
  flex-direction: column;
  justify-content: space-between;
}

.small-dvd > .dvd-inner > .bottom {
  background-color: black;
  width: 100%;
  height: 35%;
  color: white;
  text-align: center;
  vertical-align: top;
  font-size: 2em;
}

.small-dvd > .dvd-inner > .top {
  width: 100%;
  height: 35%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position-x: center;
}

.small-dvd > .dvd-inner > .bottom > p {
  margin: 0;
  padding: 0.5em;
  font-weight: bold;
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

window.customElements.define("about-channel-carousel", AboutChannelCarousel);
