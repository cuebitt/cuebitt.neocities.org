export function Toc (mainContent) {
  const tocElem = document.getElementById('toc-template').content.cloneNode(true)

  for (const section of mainContent) {
    const tocItem = document.createElement('li')
    const tocLink = document.createElement('a')
    tocLink.href = `#${section.id}`
    tocLink.textContent = section.name
    tocItem.appendChild(tocLink)
    tocElem.querySelector('.toc-nav-list').appendChild(tocItem)
  }

  return tocElem
}
