// eslint-disable-next-line no-unused-vars
const copySwatch = (e) => {
  const color = e.dataset.color;
  navigator.clipboard.writeText(color);
};

const quotes = document.getElementById("quotes").children;

quotes[Math.floor(Math.random() * quotes.length)].classList.remove("hide");
