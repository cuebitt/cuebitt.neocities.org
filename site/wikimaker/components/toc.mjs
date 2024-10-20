export function Toc (mainContent) {
  const tocFragment = document.createDocumentFragment()

  for (const section of mainContent) {
    const tocItem = document.createElement('li')
    const tocLink = document.createElement('a')
    tocLink.href = `#${section.id}`
    tocLink.textContent = section.name
    tocItem.appendChild(tocLink)
    tocFragment.appendChild(tocItem)
  }

  return tocFragment
}
