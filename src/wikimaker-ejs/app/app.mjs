import ejs from "https://esm.sh/ejs";
import { sideCard, toc, header } from "../templates/index.mjs";
import { nanoid } from "https://esm.sh/nanoid@5.0.7";
import { micromark } from "https://esm.sh/micromark@3";
import DOMPurify from "https://esm.sh/dompurify@3.1.7";
import { gfm, gfmHtml } from "https://esm.sh/micromark-extension-gfm@3?bundle";
import Alpine from "https://esm.sh/alpinejs";

// alias for convenience
const sanitize = DOMPurify.sanitize;

// default builder data
const defaultData = {
	card: {
		name: "Wikimaker",
		imageUrl: "https://placehold.co/200",
		imageAlt: "Placeholder image",
		details: [
			{
				label: "Version",
				value: "0.1",
			},
			{
				label: "Created By",
				value: "Cuebitt",
			},
		],
	},
	header: {
		title: "Wikimaker",
		subtitle: "a wiki page generator",
	},
	other: {
		faviconEmoji: "🌐",
	},
};

const loadPersistentData = () => {
	const data = window.localStorage.getItem("pageData");
	if (data) {
		// add nanoid keys to each item in card.details
		const parsedData = JSON.parse(data);
		parsedData.card.details = parsedData.card.details.map((item) => {
			return {
				...item,
				key: nanoid(),
			};
		});

		return parsedData;
	}

	const defaultDataKeyed = {
		...defaultData,
		card: {
			...defaultData.card,
			details: defaultData.card.details.map((item) => {
				return {
					...item,
					key: nanoid(),
				};
			}),
		},
	};

	return defaultDataKeyed;
};

// get data from localstorage or use default
Alpine.store("builder", {
	init() {
		Object.assign(this, loadPersistentData());
	},

	addDetail() {
		this.card.details.push({
			label: "",
			value: "",
			key: nanoid(),
		});
	},
});

Alpine.start();
