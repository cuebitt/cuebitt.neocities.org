const themeSwitcherTemplate = /* html */ `
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
`;

/*
 * Functionality for the light/dark mode theme switcher
 */

function updateTheme(theme, themeSwitcherTrigger) {
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
			themeSwitcherTrigger.querySelector(".bi-laptop").style.display = "block";
			break;
		default:
			themeSwitcherTrigger.querySelector(".bi-laptop").style.display = "block";
			document.firstElementChild.setAttribute("data-theme", "auto");
			break;
	}

	window.localStorage.setItem("theme", theme);
}

export const setupThemeSwitcher = (selector) => {
	const theme = window.localStorage.getItem("theme") || "auto";
	document.firstElementChild.setAttribute("data-theme", theme);

	// Add the theme switcher to the DOM
	const replace = document.querySelector(selector);
	replace.innerHTML = themeSwitcherTemplate;

	// Initialize the theme switcher

	if (theme === "auto") {
		replace.querySelector("#system").checked = true;
	} else {
		replace.querySelector(`#${theme}`).checked = true;
	}

	const themeSwitcher = replace.querySelector("#theme-switcher");
	const themeSwitcherTrigger = replace.querySelector("#theme-switcher-trigger");
	const dialog = replace.querySelector("#theme-switcher-dialog");

	// Update the theme when the user changes it
	themeSwitcher.addEventListener("change", (e) => {
		e.preventDefault();
		updateTheme(e.target.value, themeSwitcherTrigger);
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

	updateTheme(theme, themeSwitcherTrigger);
};
