import { Header, MainContent, Toc, RightCard } from "../components/index.mjs";
import { exportHTML } from "./export.mjs";
import { loadPersistentValues, savePersistentValues } from "./storage.mjs";
import { nanoid } from "https://esm.sh/nanoid@5.0.7";
import { Sortable, Swap } from "https://esm.sh/sortablejs";

Sortable.mount(new Swap());

function swapArrayElements(arr, indexA, indexB) {
	const temp = arr[indexA];
	arr[indexA] = arr[indexB];
	arr[indexB] = temp;
}

// util
const updateObject = (arr, id, updatedData) => {
	return arr.map((obj) => (obj.id === id ? { ...obj, ...updatedData } : obj));
};

// Input data elements
const characterNameInput = document.getElementById("character-name-input");
const characterImageInput = document.getElementById("character-image-input");
const characterImageAltInput = document.getElementById(
	"character-image-alt-input",
);
const pageTitleInput = document.getElementById("page-title-input");
const pageSubtitleInput = document.getElementById("page-subtitle-input");
const detailsTable = document.getElementById("details-table");
const emojiPickerBtn = document.getElementById("favicon-emoji-picker-btn");

// Templates
const detailsEntryTemplate = document.getElementById("details-entry-template");

function hydratePage(data) {
	// Generate the main sections
	const mainContent = MainContent(data.mainContent);
	const mainFragment = document.createDocumentFragment();
	for (const section of mainContent) {
		mainFragment.appendChild(section.elem);
	}

	const newMainContent = document.createElement("div");
	newMainContent.id = "main-content";
	newMainContent.appendChild(mainFragment);

	// Generate the other sections and insert them into the DOM
	document.getElementById("main-content").replaceWith(newMainContent);
	document
		.getElementById("side-card")
		.replaceWith(
			RightCard(
				data.card.characterName,
				data.card.characterImage,
				data.card.characterImageAlt,
				data.card.details,
			),
		);
	document.querySelector(".toc-nav-list").innerHTML = "";
	document.querySelector(".toc-nav-list").appendChild(Toc(mainContent));
	document
		.querySelector(".header")
		.replaceWith(Header(data.header.title, data.header.subtitle));

	// Set the document title and favicon
	document.title = `${data.card.characterName} - ${data.header.title}`;
	document.querySelector("#favicon").href =
		`https://fav.farm/${data.other.faviconEmoji || "🌐"}`;

	// dnd
	Sortable.create(document.querySelector(".toc-nav-list"), {
		easing: "cubic-bezier(1, 0, 0, 1)",
		animation: 150,
		onEnd: (evt) => {
			swapArrayElements(data.mainContent, evt.oldIndex, evt.newIndex);
			hydratePage(data);
			savePersistentValues(data);
		},
		swap: true,
		swapClass: "sortable-swap-highlight",
	});
}

let menuOpen = false;
function setupBuilderMenu(data) {
	// generate HTML button (always visible)
	document.getElementById("generate-html-btn").addEventListener("click", () => {
		exportHTML();
	});

	// Esc key to toggle menu dialog
	document.addEventListener("keypress", function onEvent(event) {
		if (event.key === "Escape") {
			menuOpen = !menuOpen;
			if (menuOpen) {
				document.getElementById("builder-dialog").showModal();
			}
		}
	});

	// Close the dialog with a button
	document.getElementById("close-dialog-btn").addEventListener("click", () => {
		document.getElementById("builder-dialog").close();
		menuOpen = false;
	});

	// setup details table
	renderDetailsTable(data);

	// Setup the add row button for the details table
	document.getElementById("add-row-btn").addEventListener("click", () => {
		// add new item to detailsTableItems
		data.card.details.push({ label: "", value: "", id: nanoid() });

		// render the table
		renderDetailsTable(data);
	});

	// Update the page with the new values and save to local storage
	document.getElementById("update-page-btn").addEventListener("click", () => {
		hydratePage(wikiData);
		savePersistentValues(wikiData);
	});

	// Character card form
	characterNameInput.value = data.card.characterName;
	characterNameInput.addEventListener("change", (e) => {
		wikiData.card.characterName = e.target.value || "Character";
	});

	characterImageInput.value = data.card.characterImage;
	characterImageInput.addEventListener("change", (e) => {
		wikiData.card.characterImage = e.target.value || "https://placehold.co/200";
	});

	characterImageAltInput.value = data.card.characterImageAlt;
	characterImageAltInput.addEventListener("change", (e) => {
		wikiData.card.characterImageAlt = e.target.value || "Placeholder Image";
	});

	// Page title and subtitle
	pageTitleInput.value = data.header.title;
	pageTitleInput.addEventListener("change", (e) => {
		wikiData.header.title = e.target.value || "Wikimaker";
	});

	pageSubtitleInput.value = data.header.subtitle;
	pageSubtitleInput.addEventListener("change", (e) => {
		wikiData.header.subtitle =
			e.target.value || "A character wiki page builder";
	});

	// Emoji favicon picker
	emojiPickerBtn.addEventListener("click", () => {
		document.getElementById("emoji-picker-wrapper").style.display = "block";
	});

	document
		.getElementById("emoji-picker")
		.addEventListener("emoji-click", (e) => {
			wikiData.other.faviconEmoji = e.detail.unicode;
			document.getElementById("selected-emoji").textContent = e.detail.unicode;
			document.getElementById("emoji-picker-wrapper").style.display = "none";
		});
}

function renderDetailsTable(data) {
	// Clear the details table
	const tableBody = detailsTable.querySelector("tbody");
	tableBody.innerHTML = "";

	const rows = document.createDocumentFragment();
	for (const item of data.card.details) {
		const row = detailsEntryTemplate.content.cloneNode(true);

		// set row id (nanoid used to index list)
		row.querySelector(".detail-row").id = item.id;

		// set row values
		const labelCell = row.querySelector('[name="attribute"]');
		labelCell.value = item.label;
		labelCell.addEventListener("change", (e) => {
			data.card.details = updateObject(data.card.details, item.id, {
				label: e.target.value,
			});
		});

		const valueCell = row.querySelector('[name="value"]');
		valueCell.value = item.value;
		valueCell.addEventListener("change", (e) => {
			data.card.details = updateObject(data.card.details, item.id, {
				value: e.target.value,
			});
		});

		// setup delete button
		row.querySelector(".del-row-btn").addEventListener("click", () => {
			// remove item from detailsTableItems
			data.card.details = data.card.details.filter((i) => i.id !== item.id);

			// remove row from table
			document.getElementById(item.id).remove();
		});

		rows.appendChild(row);
	}

	tableBody.appendChild(rows);
}

const wikiData = loadPersistentValues();
setupBuilderMenu(wikiData);
hydratePage(wikiData);
