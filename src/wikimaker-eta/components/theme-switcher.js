/*
 * Functionality for the light/dark mode theme switcher
 * Needs refactoring: emit a custom event when the theme is changed
 * instead of modifying the document directly
 * This used to not be a custom element, so simplify where possible
 */
class ThemeSwitcher extends HTMLElement {
	static get template() {
		return /* html */ `
<div id="theme-switcher-component">
	<div class="dropdown-container">
		<button class="light-dark-switcher" aria-label="light and dark mode switcher" id="theme-switcher-trigger">
			<i class="bi bi-moon-stars"></i>
			<i class="bi bi-sun"></i>
			<i class="bi bi-laptop"></i>
		</button>

		<dialog class="dropdown-menu" id="theme-switcher-dialog">
			<form id="theme-switcher">
				<span>
					<input type="radio" name="theme" id="dark" value="dark" />
					<label for="dark">
						<i class="bi bi-moon-stars off"></i>
						<i class="bi bi-moon-stars-fill on"></i>
						Dark
					</label>
				</span>

				<span>
					<input type="radio" name="theme" id="light" value="light" />
					<label for="light">
						<i class="bi bi-sun off"></i>
						<i class="bi bi-sun-fill on"></i>
						Light
					</label>
				</span>

				<span>
					<input type="radio" name="theme" id="system" value="auto" />
					<label for="system">
						<i class="bi bi-laptop off"></i>
						<i class="bi bi-laptop-fill on"></i>
						System
					</label>
				</span>
			</form>
		</dialog>
	</div>
  </div>
`;
	}

	static get styles() {
		return /* css */ `
@import url("https://unpkg.com/open-props@1.7.7");
@import url("https://unpkg.com/open-props@1.7.7/normalize.min.css");
@import url("https://unpkg.com/open-props@1.7.7/buttons.min.css");
@import url("https://unpkg.com/open-props@1.7.7/theme.light.switch.min.css");
@import url("https://unpkg.com/open-props@1.7.7/theme.dark.switch.min.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

/* theme switcher component */

.dropdown-container {
	position: relative;
	height: fit-content;
}

.light-dark-switcher {
	padding: var(--size-1) var(--size-2);
	aspect-ratio: var(--ratio-square);
}

.dropdown-menu {
	position: absolute;
	left: 0;
	top: 0;
	transform: translateX(-60%);
	z-index: var(--layer-important);
	border-width: var(--border-size-2);
	border-radius: var(--radius-2);
	padding: var(--size-1);
	width: fit-content;
	white-space: nowrap;
	background-color: var(--surface-1);
}

.dropdown-menu form {
	display: inline-flex;
	flex-direction: column;
}

.dropdown-menu input[type="radio"] {
	display: none;
}

.dropdown-menu label {
	width: 100%;
	padding: var(--size-1) var(--size-2);
	border-radius: var(--radius-2);
}

.dropdown-menu span {
	width: 100%;
	display: flex;
}

.dropdown-menu label:hover {
	background-color: var(--surface-2);
}

.dropdown-menu label i {
	margin-right: var(--size-1);
}

.dropdown-menu input[type="radio"]:checked + label .on,
.dropdown-menu input[type="radio"]:not(:checked) + label .off {
	display: inline-block;
}

.dropdown-menu input[type="radio"]:checked + label .off,
.dropdown-menu input[type="radio"]:not(:checked) + label .on {
	display: none;
}

	`;
	}

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = ThemeSwitcher.template;

		const css = document.createElement("style");
		css.innerHTML = ThemeSwitcher.styles;
		this.shadowRoot.prepend(css);

		this.setupThemeSwitcher();
	}

	updateTheme(theme, themeSwitcherTrigger) {
		// Hide all icons
		for (const icon of themeSwitcherTrigger.querySelectorAll("i.bi")) {
			icon.style.display = "none";
		}

		document.firstElementChild.setAttribute("data-theme", theme);
		switch (theme) {
			case "light":
				themeSwitcherTrigger.querySelector(".bi-sun").style.display = "block";
				break;
			case "dark":
				themeSwitcherTrigger.querySelector(".bi-moon-stars").style.display =
					"block";
				break;
			case "auto":
				themeSwitcherTrigger.querySelector(".bi-laptop").style.display =
					"block";
				break;
			default:
				themeSwitcherTrigger.querySelector(".bi-laptop").style.display =
					"block";
				document.firstElementChild.setAttribute("data-theme", "auto");
				break;
		}

		window.localStorage.setItem("theme", theme);
	}

	setupThemeSwitcher() {
		const theme = window.localStorage.getItem("theme") || "auto";
		document.firstElementChild.setAttribute("data-theme", theme);

		// Add the theme switcher to the DOM
		const replace = this.shadowRoot.getElementById("theme-switcher-component");

		// Initialize the theme switcher

		if (theme === "auto") {
			replace.querySelector("#system").checked = true;
		} else {
			replace.querySelector(`#${theme}`).checked = true;
		}

		const themeSwitcher = replace.querySelector("#theme-switcher");
		const themeSwitcherTrigger = replace.querySelector(
			"#theme-switcher-trigger",
		);
		const dialog = replace.querySelector("#theme-switcher-dialog");

		// Update the theme when the user changes it
		themeSwitcher.addEventListener("change", (e) => {
			e.preventDefault();
			this.updateTheme(e.target.value, themeSwitcherTrigger);
		});

		// Close the dialog when the user clicks outside of it
		window.addEventListener("click", (event) => {
			if (!dialog.contains(event.target)) {
				dialog.close();
			}
		});

		// Open the dialog when the user clicks the trigger button
		themeSwitcherTrigger.addEventListener("click", (e) => {
			e.stopPropagation();

			if (dialog.open) {
				dialog.close();
			} else {
				dialog.show();
			}
		});

		this.updateTheme(theme, themeSwitcherTrigger);
	}
}

window.customElements.define("theme-switcher", ThemeSwitcher);
