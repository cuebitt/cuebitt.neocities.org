// Generate a list of <script> tags using JSDelivr links
const generateTagList = (ids, tagItems) => {
  const cdnLinks = new Set();
  ids.forEach((id) => {
    const tagItemSrc = tagItems[id].source;
    const jsSrc = `https://cdn.jsdelivr.net/gh/${tagItemSrc.user}/${tagItemSrc.repository}/${tagItemSrc.filePath}`;

    cdnLinks.add(String.raw`<script type="module" src="${jsSrc}"></script>`);
  });

  return [...cdnLinks];
};

// Generate a list of URLs that point to the help document for each component
const generateHelpList = (ids, tagItems) => {
  const helpLinks = new Set();
  ids.forEach((id) => {
    const helpItemSrc = tagItems[id].source;
    const helpUrl = `https://github.com/${helpItemSrc.user}/${helpItemSrc.repository}/tree/main/${helpItemSrc.helpPath}`;

    helpLinks.add(helpUrl);
  });

  return [...helpLinks];
};

window.WebComponentShop = {
  generateTagList,
  generateHelpList,
};
