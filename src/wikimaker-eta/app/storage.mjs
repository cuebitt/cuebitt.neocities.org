import { nanoid } from "https://esm.sh/nanoid@5.0.7";

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
	mainContent: [
		{
			id: "about",
			type: "text",
			heading: "About",
			content:
				"Welcome to WikiMaker! WikiMaker is a simple wiki page generator that produces static web pages that you can easily upload to a number of free web hosts. To begin editing, press the `Escape` key to open the menu.",
		},
	],
};

// utility, adds nanoid keys to the details array so it can be sorted
const addKeysToDetails = (details) => {
	return details.map((item) => {
		return {
			...item,
			key: nanoid(),
		};
	});
};

const loadPersistentData = () => {
	const data = window.localStorage.getItem("pageData");

	if (data) {
		const parsedData = JSON.parse(data);
		const defaultDataKeyed = {
			...parsedData,
			card: {
				...parsedData.card,
				details: addKeysToDetails(parsedData.card.details),
			},
		};
		return defaultDataKeyed;
	}

	const defaultDataKeyed = {
		...defaultData,
		card: {
			...defaultData.card,
			details: addKeysToDetails(defaultData.card.details),
		},
	};
	return defaultDataKeyed;
};

export { loadPersistentData };
