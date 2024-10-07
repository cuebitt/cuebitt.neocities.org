import confetti from "https://esm.sh/canvas-confetti@1.6.0";

// Set age value
document.getElementById("age-text").textContent =
  `${Math.floor(Math.abs(Date.now() - new Date("2001-05-21")) / 31556952000)}yrs`;

// Set pronouns from PronounDB
const pronounDbId = `0185dc21-e518-736c-aa79-6f1e365f064e`;
fetch(`https://pronoundb.org/api/v2/users/${pronounDbId}`)
  .then((res) => res.json())
  .then((data) => {
    const pronounSets = data["sets"]["en"];
    const pronouns = [];

    for (const pSet of pronounSets) {
      switch (pSet) {
        case "he":
          pronouns.push("he/him");
          break;
        case "she":
          pronouns.push("she/her");
          break;
        case "they":
          pronouns.push("they/them");
          break;
        case "it":
          pronouns.push("it/its");
          break;
        case "any":
          pronouns.push("Any pronouns");
          break;
        case "ask":
          pronouns.push("Ask me my pronouns");
          break;
        case "avoid":
          pronouns.push("Avoid pronouns, use my name");
          break;
        case "other":
          pronouns.push("Other pronouns");
          break;
      }
    }
    let pStr = "";
    if (pronouns.length > 1) {
      const pFirst = [];
      pronouns.forEach((p) => {
        pFirst.push(p.split("/")[0]);
      });

      pStr = pFirst.join("/");
    } else {
      pStr = pronouns[0];
    }

    const pText = document.getElementById("pronouns-text");
    pText.removeAttribute("aria-busy");
    pText.dataset.tooltip = "via pronoundb.org";
    pText.textContent = pStr;
  });

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
