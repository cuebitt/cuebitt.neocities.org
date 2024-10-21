const imgModal = document.getElementById("image-modal");
const imgModalImg = document.getElementById("image-modal-image");
const imgModalCaption = document.getElementById("image-modal-caption");

function createArtGalleryItem(
	imgSrc,
	imgAlt,
	artistName,
	artistUrl,
	date,
	blur,
) {
	const figure = document.createElement("figure");
	const img = document.createElement("img");
	const figcaption = document.createElement("figcaption");
	const a = document.createElement("a");

	img.src = imgSrc;
	img.alt = imgAlt;
	img.dataset.artist = artistName;
	if (blur) {
		img.classList.add("hover-unblur");
	}

	a.href = artistUrl;
	a.target = "_blank";
	a.rel = "noopener noreferrer";
	a.textContent = artistName;

	figcaption.append(a, `, ${date}`);
	figure.append(img, figcaption);

	return figure;
}

async function makeArtGallery() {
	const response = await fetch("/art/gallery.json");
	const data = await response.json();
	const gallery = document.querySelector(".art-grid");

	const dataDateParsed = data
		.map((item) => {
			item.date = new Date(item.date);
			return item;
		})
		.sort((a, b) => a.date - b.date);

	for (item of dataDateParsed) {
		gallery.append(
			createArtGalleryItem(
				item.img_src,
				item.img_alt,
				item.artist_name,
				item.artist_url,
				item.date.toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
				}),
				item.blur,
			),
		);
	}
	gallery.ariaBusy = false;
}

function openImageModal(imgSrc, imgAlt, artistName) {
	imgModalImg.src = imgSrc;
	imgModalImg.alt = imgAlt;

	imgModalCaption.textContent = `by ${artistName}`;

	imgModal.showModal();
}

function setupImageModal() {
	for (element of [].slice.call(document.getElementsByTagName("img"))) {
		if ("artist" in element.dataset) {
			element.addEventListener("click", (e) => {
				openImageModal(e.target.src, e.target.alt, e.target.dataset.artist);
			});
		}
	}
}

function rgbToHex(r, g, b) {
	return ((1 << 24) + (r << 16) + (g << 8) + b)
		.toString(16)
		.slice(1)
		.toUpperCase();
}

function setupSwatchCopy() {
	for (element of Array.from(document.querySelectorAll(".swatch-copy"))) {
		const rgbColor = window
			.getComputedStyle(element)
			.getPropertyValue("background-color");
		const rgbVals = rgbColor.match(/\d+/g).map(Number);
		const hexColor = rgbToHex(rgbVals[0], rgbVals[1], rgbVals[2]);

		element.addEventListener("click", () => {
			navigator.clipboard.writeText(hexColor);
			window.alert("Copied!");
		});
	}
}

makeArtGallery().then(() => setupImageModal());
setupSwatchCopy();
