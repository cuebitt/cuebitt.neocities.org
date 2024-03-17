document.addEventListener("alpine:init", () => {
  window.Alpine.store("modalOpen", {
    about: false,
    cart: false,
    genTags: false,
  });

  window.Alpine.store("shopItems", {});
  window.Alpine.store("filteredShopItems", {});
  window.Alpine.store("shoppingCart", new Set());

  window.Alpine.store("generatedScriptTags", {
    genTags: [],
    genHelp: [],
  });

  // Fetch the shop items from shopItems.json
  const initShopItems = async () => {
    const shopItemsResp = await (await fetch("shopItems.json")).json();

    window.Alpine.store("shopItems", shopItemsResp);
    window.Alpine.store("filteredShopItems", { ...shopItemsResp });
  };

  initShopItems();
});
