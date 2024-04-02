// these portions don't really need to be web components since they're just
// static templates and I want them to inherit the styles from the main site

/**
 * Creates a list of script tags for the items in the shopping cart
 * @param {string[]} ids Iterable of item ids
 * @param {Object[]} items Map of item ids to item objects
 * @param {boolean} minify Whether to use minified versions of the scripts
 * @returns {string[]} Array of script tags as strings
 */
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

/**
 * Generates a list of help links for the items in the shopping cart
 * @param {string[]} ids Iterable of item ids
 * @param {Object[]} items Map of item ids to item objects
 * @returns {HTMLLIElement[]} Array of list items with help links
 */
const helpList = (ids, items) => {
  const helpLinks = new Map();
  ids.forEach((id) => {
    const helpItemSrc = items.get(id).source;
    const helpUrl = `https://github.com/${helpItemSrc.user}/${helpItemSrc.repository}/tree/${helpItemSrc.tag}/${helpItemSrc.helpPath}`;

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

/**
 * Creates a new item card element using a template
 * @param {string} templateSelector CSS selector for the template element
 * @param {*} id the item's id
 * @param {*} item the item's information from shopItems.json
 * @param {*} clickHandler function to handle the add to cart button's click event
 * @returns {HTMLArticleElement} the item card element
 */
const createItemCard = (templateSelector, id, item, clickHandler) => {
  const template = document.querySelector(templateSelector);
  const itemCardItem = template.content.cloneNode(true);

  itemCardItem.querySelector(".item-card").id = id;

  itemCardItem.querySelector("#item-name-header").textContent = item.itemName;
  itemCardItem.querySelector("#item-img").src = item.imgUrl;
  itemCardItem.querySelector("#item-img").alt = item.imgAlt;
  itemCardItem.querySelector("#item-desc").textContent = item.desc;

  itemCardItem.querySelector("#src-link").href =
    `https://github.com/${item.source.user}/${item.source.repository}/tree/main/${item.source.filePath}`;

  itemCardItem
    .querySelector("#add-to-cart-btn")
    .addEventListener("click", () => {
      clickHandler(id);
    });

  return itemCardItem;
};

/**
 * Creates a new cart item table row element using a template
 * @param {string} templateSelector CSS selector for the template element
 * @param {*} id the item's id
 * @param {*} item the item's information from shopItems.json
 * @param {*} clickHandler function to handle the remove from cart button's click event
 * @returns {HTMLArticleElement} the item table row element
 */
const createCartItemTableRow = (templateSelector, id, item, clickHandler) => {
  const template = document.querySelector(templateSelector);
  const itemCartRow = template.content.cloneNode(true);

  itemCartRow.querySelector(".item-table-row").id = id;

  itemCartRow.querySelector("#item-name").textContent = item.itemName;
  itemCartRow.querySelector("#item-author").textContent = item.source.user;

  itemCartRow.querySelector("#remove-button").addEventListener("click", () => {
    clickHandler(id);
  });

  return itemCartRow;
};

export { createCartItemTableRow, scriptTagsText, helpList, createItemCard };
