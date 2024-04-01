// these portions don't really need to be web components since they're just
// static templates and I want them to inherit the styles from the main site

// Constructs an item card template for each item in the shopItems.json file.
const itemCard = (id, item, clickHandler) => {
  const content = /* html */ `
    <header>
      <strong id="item-name-header">${item.itemName}</strong>
    </header>

    <section class="container picture-container">
      <img id="item-img" src="${item.imgUrl}" alt="${item.imgAlt}" />
    </section>

    <section class="item-desc-section">
      <p id="item-desc">${item.desc}</p>
    </section>

    <footer class="card-bottom-buttons">
      <a
        href="https://github.com/${item.source.user}/${item.source
          .repository}/tree/main/${item.source.filePath}"
        id="src-link"
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        style="width: 3rem"
        class="secondary"
        data-tooltip="Source Code"
        aria-label="source code"
        ><i class="bi bi-code-slash"></i
      ></a>
      <button
        aria-label="add to cart"
        data-tooltip="Add to Cart"
        id="add-to-cart-btn"
      >
        <i class="bi bi-bag-plus"></i>
      </button>
    </footer>
    `;

  // Construct item card
  const itemCardItem = document.createElement("article");
  itemCardItem.innerHTML = content;
  itemCardItem.classList.add("item-card");

  // Set the id of the item card
  itemCardItem.id = id;

  // Set "add to cart" handler
  itemCardItem
    .querySelector("#add-to-cart-btn")
    .addEventListener("click", () => {
      clickHandler(id);
    });

  return itemCardItem;
};

const itemCartTableRow = ([id, item], onRemoved) => {
  const content = /* html */ `
      <th scope="row">${item.itemName}</th>
    <td>${item.source.user}</td>
    <td>$0.00</td>
    <td>
      <button
        data-tooltip="Remove from Cart"
        data-placement="left"
        id="remove-button"
      >
        <i class="bi bi-trash"></i>
      </button>
    </td>
  `;

  const itemCartRow = document.createElement("tr");
  itemCartRow.innerHTML = content;
  itemCartRow.id = id;

  itemCartRow.querySelector("#remove-button").addEventListener("click", () => {
    onRemoved(id);
  });

  return itemCartRow;
};

const scriptTagsText = (ids, items, minify) => {
  const cdnLinks = new Set();
  ids.forEach((id) => {
    const tagItemSrc = { ...items.get(id).source };

    if (minify) {
      tagItemSrc.filePath = tagItemSrc.filePath.replace(".js", ".min.js");
    }

    const jsSrc = Object.prototype.hasOwnProperty.call(tagItemSrc, "tag")
      ? `https://cdn.jsdelivr.net/gh/${tagItemSrc.user}/${tagItemSrc.repository}@${tagItemSrc.tag}/${tagItemSrc.filePath}`
      : `https://cdn.jsdelivr.net/gh/${tagItemSrc.user}/${tagItemSrc.repository}/${tagItemSrc.filePath}`;

    cdnLinks.add(String.raw`<script type="module" src="${jsSrc}"></script>`);
  });

  return [...cdnLinks];
};

const helpList = (ids, items) => {
  const helpLinks = new Map();
  ids.forEach((id) => {
    const helpItemSrc = items.get(id).source;
    const helpUrl = `https://github.com/${helpItemSrc.user}/${helpItemSrc.repository}/tree/main/${helpItemSrc.helpPath}`;

    helpLinks.set(helpUrl.split("/").slice(-2).join("/"), helpUrl);
  });

  return [...helpLinks].map(([name, url]) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = /* html */ `
      <a
        href="${url}"
        target="_blank"
        rel="noopener noreferrer"
        >${name}</a
      >
    `;

    return listItem;
  });
};

export { itemCard, itemCartTableRow, scriptTagsText, helpList };
