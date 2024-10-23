import { nanoid } from "https://esm.sh/nanoid@5.0.7";
import DOMPurify from "https://esm.sh/dompurify@3.1.7";
import Alpine from "https://esm.sh/alpinejs";
import { micromark } from "https://esm.sh/micromark@3";
import { gfm, gfmHtml } from "https://esm.sh/micromark-extension-gfm@3?bundle";
import { Eta } from "https://esm.sh/eta";
import { loadPersistentData } from "./storage.mjs";
import {
	header,
	mainContent,
	sideCard,
	wiki,
	toc,
	textSection,
} from "../partials/index.mjs";

// alias for convenience
const sanitize = DOMPurify.sanitize;

const markdownToHtml = (markdown) => {
	const html = micromark(markdown, {
		extensions: [gfm()],
		htmlExtensions: [gfmHtml()],
	});
	return DOMPurify.sanitize(html);
};

// Init state with page builder data
Alpine.store("builder", {
	init() {
		Object.assign(this, loadPersistentData());
	},

	// convenience method to add a new detail to the card
	addDetail() {
		this.card.details.push({
			label: "",
			value: "",
			key: nanoid(),
		});
	},
});

Alpine.start();

// Load templates
const eta = new Eta();

eta.loadTemplate("@header", header);
eta.loadTemplate("@mainContent", mainContent);
eta.loadTemplate("@sideCard", sideCard);
eta.loadTemplate("@wiki", wiki);
eta.loadTemplate("@toc", toc);
eta.loadTemplate("@textSection", textSection);
const css = await (await fetch("styles/wiki.css")).text();

// Render the page
const updatePreview = () => {
	const data = {
		...Alpine.store("builder"),
		styles: css,
		mdToHtml: markdownToHtml,
	};
	const res = eta.render("@wiki", data);

	const frame =
		document.getElementById("page-preview-frame").contentWindow.document;
	frame.open();
	frame.write(res);
	frame.close();
};

// Update the preview when the page loads
updatePreview();

// Update the preview when the user clicks the button
document
	.getElementById("update-page-btn")
	.addEventListener("click", updatePreview);
