import { computePosition, flip, shift, offset } from "@floating-ui/dom";
import { Howl } from "howler";
import { nanoid } from "nanoid";

// Create tooltips
const tooltipElems = [];
document.querySelectorAll("[data-tooltip]").forEach((channel) => {
  const tooltip = document
    .getElementById("tooltip-template")
    .content.cloneNode(true);
  tooltip.querySelector("#tooltip").textContent = channel.dataset.tooltip;

  const id = nanoid();

  tooltip.querySelector("#tooltip").id = id;
  document.body.appendChild(tooltip);

  channel.setAttribute("aria-describedby", id);

  tooltipElems.push({
    elem: channel,
    tooltip: document.getElementById(`${id}`),
  });
});

// Tooltip hover sound
let tooltipAppearSfxReady = false;
const tooltipAppearSfx = new Howl({
  src: ["https://files.catbox.moe/3x2h7u.mp3"],
  volume: 0.3,
  onload: () => {
    tooltipAppearSfxReady = true;
  },
});

const update = (elem, tooltip) => {
  computePosition(elem, tooltip, {
    placement: "bottom",
    middleware: [flip(), shift({ padding: 5 }), offset(10)],
  }).then(({ x, y }) => {
    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });
};

function showTooltip(elem, tooltip) {
  tooltip.style.display = "block";
  update(elem, tooltip);
  if (tooltipAppearSfxReady) {
    tooltipAppearSfx.play();
  }
}

function hideTooltip(elem, tooltip) {
  tooltip.style.display = "";
}

tooltipElems.forEach(({ elem, tooltip }) => {
  [
    ["mouseenter", showTooltip],
    ["mouseleave", hideTooltip],
    ["focus", showTooltip],
    ["blur", hideTooltip],
  ].forEach(([event, listener]) => {
    elem.addEventListener(event, () => {
      listener(elem, tooltip);
    });
  });
});
