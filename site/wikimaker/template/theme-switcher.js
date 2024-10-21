/*
 * Functionality for the light/dark mode theme switcher
 */
const themeSwitcher = document.getElementById("theme-switcher");
const themeSwitcherTrigger = document.getElementById("theme-switcher-trigger");
const dialog = document.getElementById("theme-switcher-dialog");

function updateTheme(theme) {
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

// Update the theme when the user changes it
themeSwitcher.addEventListener("change", (e) => {
	e.preventDefault();
	updateTheme(e.target.value);
});

// Close the dialog when the user clicks outside of it
window.addEventListener("click", (event) => {
	if (!dialog.contains(event.target)) {
		dialog.close();
	}
});

// Open the dialog when the user clicks the trigger button
document
	.getElementById("theme-switcher-trigger")
	.addEventListener("click", (e) => {
		e.stopPropagation();

		if (dialog.open) {
			dialog.close();
		} else {
			dialog.show();
		}
	});

// Initialize the theme from local storage
const theme = window.localStorage.getItem("theme") || "auto";

if (theme === "auto") {
	document.getElementById("system").checked = true;
} else {
	document.getElementById(theme).checked = true;
}
updateTheme(theme);
