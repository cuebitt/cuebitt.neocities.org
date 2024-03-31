import confetti from "https://esm.sh/canvas-confetti@1.6.0";

// Add event handlers to dialog buttons
document.getElementById("nso-btn").addEventListener("click", () => {
  document.getElementById("nso-modal").showModal();
});

document.getElementById("discord-btn").addEventListener("click", () => {
  document.getElementById("discord-modal").showModal();
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
