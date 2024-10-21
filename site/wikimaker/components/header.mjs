export function Header(title, subtitle) {
	const headerElem = document
		.getElementById("header-template")
		.content.cloneNode(true);

	headerElem.querySelector("hgroup h1").textContent = title;
	headerElem.querySelector("hgroup h2").textContent = subtitle;

	return headerElem;
}
