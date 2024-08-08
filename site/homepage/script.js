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
    pText.textContent = pStr;
  });
