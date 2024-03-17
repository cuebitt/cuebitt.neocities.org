class CuebittFooter extends HTMLElement {
  constructor() {
    super();

    this._element = null;
    this._connected = false;

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    this._connected = true;
  }

  render() {
    const footerTemplate = document.createElement("template");
    footerTemplate.innerHTML = CuebittFooter.template();

    this.shadowRoot.appendChild(footerTemplate.content.cloneNode(true));

    this._element = this.shadowRoot.querySelector("footer");
  }

  static template() {
    return /* html */ `
        <style>
            .flex {
                display: flex;
            }

            .flex-column {
                flex-direction: column;
            }

            .justify-center {
                justify-content: center;
            }

            nav > ul {
            list-style-type: none;
            padding: 0;
            }

            nav > ul > li {
                display: inline-block;
                padding: 0 0.5rem;
            }

            nav li :where(a,[role=link]):not(:hover) {
                text-decoration: none;
            }
        </style>

        <footer>
        <hr />
        <div class="flex flex-column">
          <section class="flex justify-center">
            <nav>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/sitemap">Sitemap</a></li>
                <li>
                  <a
                    href="http://github.com/cuebitt/cuebitt.neocities.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Source</a
                  >
                </li>
              </ul>
            </nav>
          </section>
          <section class="flex justify-center">
            <a
              href="http://neocities.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="Hosted by Neocities"
                src="https://cdn.jsdelivr.net/gh/neocities/neocities@master/public/img/neocitiesbadge.svg"
              />
            </a>
          </section>
        </div>
      </footer>
        `;
  }
}

window.customElements.define("cuebitt-footer", CuebittFooter);
