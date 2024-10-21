import confetti from "https://esm.sh/canvas-confetti@1.6.0";

// Add event handlers to dialog buttons
const nsoModal = document.getElementById("nso-modal");
document.getElementById("nso-btn").addEventListener("click", () => {
	nsoModal.showModal();
});
document
	.querySelector("#nso-modal > article > header > button[rel=prev]")
	.addEventListener("click", () => {
		nsoModal.close();
	});

const discordModal = document.getElementById("discord-modal");
document.getElementById("discord-btn").addEventListener("click", () => {
	discordModal.showModal();
});
document
	.querySelector("#discord-modal > article > header > button[rel=prev]")
	.addEventListener("click", () => {
		discordModal.close();
	});

const vrcModal = document.getElementById("vrc-modal");
document.getElementById("vrc-btn").addEventListener("click", () => {
	vrcModal.showModal();
});
document
	.querySelector("#vrc-modal > article > header > button[rel=prev]")
	.addEventListener("click", () => {
		vrcModal.close();
	});
// Add event handler (confetti) to the profile photo
document.querySelector(".avatar-container").addEventListener("click", (e) => {
	const box = e.target.getBoundingClientRect();
	const docElem = document.documentElement;

	const origin = {
		x:
			(box.left + window.scrollX - docElem.clientLeft + box.width / 2) /
			window.innerWidth,
		y:
			(box.top + window.scrollY - docElem.clientTop + box.height) /
			window.innerHeight,
	};
	confetti({
		origin,
	});
});
