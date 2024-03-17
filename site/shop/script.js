// Generate a list of <script> tags using JSDelivr links
const generateTagList = (ids) => {
  const cdnLinks = new Set();
  ids.forEach((id) => {
    const tagItemSrc = window.Alpine.store("shopItems")[id].source;

    const jsSrc = Object.prototype.hasOwnProperty.call(tagItemSrc, "tag")
      ? `https://cdn.jsdelivr.net/gh/${tagItemSrc.user}/${tagItemSrc.repository}@${tagItemSrc.tag}/${tagItemSrc.filePath}`
      : `https://cdn.jsdelivr.net/gh/${tagItemSrc.user}/${tagItemSrc.repository}/${tagItemSrc.filePath}`;

    cdnLinks.add(String.raw`<script type="module" src="${jsSrc}"></script>`);
  });

  return [...cdnLinks];
};

// Generate a list of URLs that point to the help document for each component
const generateHelpList = (ids) => {
  const helpLinks = new Set();
  ids.forEach((id) => {
    const helpItemSrc = window.Alpine.store("shopItems")[id].source;
    const helpUrl = `https://github.com/${helpItemSrc.user}/${helpItemSrc.repository}/tree/main/${helpItemSrc.helpPath}`;

    helpLinks.add(helpUrl);
  });

  return [...helpLinks];
};

// Filter an object based on its keys
// Returns an object whose keys start with or are filterString
// Used by the search bar
const filterObject = (obj, filterString) => {
  if (filterString === "") {
    return { ...obj };
  }

  const filteredObj = {};
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    if (key.startsWith(filterString) || key.includes(filterString)) {
      filteredObj[key] = obj[key];
    }
  });

  return filteredObj;
};

const doCheckout = () => {
  window.Alpine.store("generatedScriptTags").genTags =
    window.WebComponentShop.generateTagList(
      window.Alpine.store("shoppingCart"),
    );
  window.Alpine.store("generatedScriptTags").genHelp =
    window.WebComponentShop.generateHelpList(
      window.Alpine.store("shoppingCart"),
    );
  window.Alpine.store("modalOpen").cart = false;
  window.Alpine.store("shoppingCart").clear();
  window.Alpine.store("modalOpen").genTags = true;
};

window.WebComponentShop = {
  generateTagList,
  generateHelpList,
  filterObject,
  doCheckout,
};
