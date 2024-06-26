import {
  createItemCard,
  createCartItemTableRow,
  scriptTagsText,
  helpList,
} from "./templates.js";

const Prism = window.Prism;

window.WebComponentShop = {
  shopItems: new Map(),
  filteredShopItems: [],
  shoppingCart: new Set(),
  minify: false,
};

// Fetch the shopItems.json file
const getShopItems = async () => {
  const response = await fetch("/shop/shopItems.json");
  const data = await response.json();
  return data;
};

// Init the shop items state
getShopItems().then((data) => {
  document.querySelector("#loading-div").style.display = "none";
  window.WebComponentShop.shopItems = new Map(Object.entries(data));
  window.WebComponentShop.filteredShopItems = [
    ...window.WebComponentShop.shopItems.keys(),
  ];

  // MapIterator's map method isn't supported by Safari, so cast to an array first
  const shopItems = [...window.WebComponentShop.shopItems.entries()].map(
    ([id, item]) =>
      createItemCard("#item-card-template", id, item, (id) => {
        document.querySelector("#wc-toast-contents").textContent =
          `Added ${item.itemName} to the cart!`;
        document.querySelector("#wc-toast").open();
        window.WebComponentShop.shoppingCart.add(id);
      }),
  );
  const shopItemsContainer = document.querySelector("#shop-items-container");
  shopItems.forEach((item) => shopItemsContainer.appendChild(item));
});

// Init event handlers
const cartModal = document.querySelector("#cart-modal");
const cartEmpty = document.querySelector("#cart-empty");
const cartTable = document.querySelector("#cart-table");
const cartTableBody = document.querySelector("#cart-table > tbody");
const helpListElem = document.querySelector("#generated-help-list");

// helper - renders the checkout table
const renderCheckoutTable = (ids, items, onRemove) => {
  const cartEmpty = document.querySelector("#cart-empty");
  const cartTable = document.querySelector("#cart-table");
  const cartTableBody = document.querySelector("#cart-table > tbody");

  if ([...ids].length === 0) {
    cartEmpty.style.removeProperty("display");
    cartTable.style.display = "none";

    document.querySelector("#checkout-btn").disabled = true;
    document.querySelector("#clear-cart-btn").disabled = true;
  } else {
    cartEmpty.style.display = "none";
    cartTable.style.removeProperty("display");
    cartTableBody.innerHTML = "";

    document.querySelector("#checkout-btn").disabled = false;
    document.querySelector("#clear-cart-btn").disabled = false;

    [...items]
      // eslint-disable-next-line no-unused-vars
      .filter(([id, _item]) => {
        return ids.has(id);
      })
      .map((item) =>
        createCartItemTableRow(
          "#item-table-row-template",
          item[0],
          item[1],
          () => {
            onRemove(item[0]);
            cartTableBody.querySelector(`#${item[0]}`).remove();
          },
        ),
      )
      .forEach((item) => cartTableBody.appendChild(item));
  }
};

document.querySelector("#search-bar").addEventListener("input", (e) => {
  // Save the previous filtered items
  const prev = window.WebComponentShop.filteredShopItems.slice();

  if (e.target.value === "") {
    window.WebComponentShop.filteredShopItems = [
      ...window.WebComponentShop.shopItems.keys(),
    ];
  } else {
    window.WebComponentShop.filteredShopItems = [
      ...window.WebComponentShop.shopItems.entries(),
    ]
      // eslint-disable-next-line no-unused-vars
      .filter(([id, item]) =>
        item.itemName.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      // eslint-disable-next-line no-unused-vars
      .map(([id, _item]) => id);
  }

  // If the new filtered items are different from the previous, re-render the shop items
  if (prev !== window.WebComponentShop.filteredShopItems) {
    document.querySelector("#shop-items-container").innerHTML = "";
    window.WebComponentShop.filteredShopItems
      .map((id) =>
        createItemCard(
          "#item-card-template",
          id,
          window.WebComponentShop.shopItems.get(id),
          (id) => {
            window.WebComponentShop.shoppingCart.add(id);
          },
        ),
      )
      .forEach((item) =>
        document.querySelector("#shop-items-container").appendChild(item),
      );
  }
});

document.querySelector("#cart-btn").addEventListener("click", () => {
  renderCheckoutTable(
    window.WebComponentShop.shoppingCart,
    window.WebComponentShop.shopItems,
    (id) => {
      window.WebComponentShop.shoppingCart.delete(id);

      if (window.WebComponentShop.shoppingCart.size === 0) {
        cartEmpty.style.removeProperty("display");
        cartTable.style.display = "none";

        document.querySelector("#checkout-btn").disabled = true;
        document.querySelector("#clear-cart-btn").disabled = true;
      }
    },
  );

  cartModal.showModal();
});
document
  .querySelector("#cart-modal > article > header > button[rel=prev]")
  .addEventListener("click", () => {
    cartModal.close();
  });
document.querySelector("#clear-cart-btn").addEventListener("click", () => {
  window.WebComponentShop.shoppingCart.clear();
  cartTableBody.innerHTML = "";

  cartEmpty.style.removeProperty("display");
  cartTable.style.display = "none";

  document.querySelector("#checkout-btn").disabled = true;
  document.querySelector("#clear-cart-btn").disabled = true;
});
document.querySelector("#checkout-btn").addEventListener("click", () => {
  cartModal.close();
  checkoutModal.showModal();

  const scriptTagsTextContent = scriptTagsText(
    window.WebComponentShop.shoppingCart,
    window.WebComponentShop.shopItems,
    window.WebComponentShop.minify,
  );

  const helpListLinks = helpList(
    window.WebComponentShop.shoppingCart,
    window.WebComponentShop.shopItems,
  );

  // document.querySelector("#generated-script-tags").textContent =
  //   scriptTagsTextContent.join("\n");
  document.querySelector("#generated-script-tags").innerHTML = Prism.highlight(
    scriptTagsTextContent.join("\n"),
    Prism.languages.html,
    "html",
  );
  helpListLinks.forEach((link) => helpListElem.appendChild(link));
});
document.querySelector("#minify-checkbox").addEventListener("change", (e) => {
  window.WebComponentShop.minify = e.target.checked;
});

const aboutModal = document.querySelector("#about-modal");
document.querySelector("#about-btn").addEventListener("click", () => {
  aboutModal.showModal();
});
document
  .querySelector("#about-modal > article > header > button[rel=prev]")
  .addEventListener("click", () => {
    aboutModal.close();
  });

const checkoutModal = document.querySelector("#checkout-modal");
let copyTimeoutId = null;
document
  .querySelector("#checkout-modal > article > header > button[rel=prev]")
  .addEventListener("click", () => {
    checkoutModal.close();
  });
document.querySelector("#tag-copy-btn").addEventListener("click", () => {
  navigator.clipboard.writeText(
    document.querySelector("#generated-script-tags").textContent,
  );
  document.querySelector("#tag-copy-btn").dataset.tooltip = "Copied!";
  if (copyTimeoutId) clearTimeout(copyTimeoutId);
  copyTimeoutId = setTimeout(() => {
    document.querySelector("#tag-copy-btn").dataset.tooltip = "Click to copy!";
  }, 2000);
});
