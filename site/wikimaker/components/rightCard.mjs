export function RightCard (name, imgSrc, imgAlt, details) {
  const cardElem = document.getElementById('right-card-template').content.cloneNode(true)

  // Set values
  cardElem.querySelector('.card-header-name').textContent = name
  const img = cardElem.querySelector('.side-image')
  img.src = imgSrc
  img.alt = imgAlt

  const detailsTable = cardElem.querySelector('.side-card-table-body')
  for (const detail of details) {
    if (!detail.label.trim() && !detail.value.trim()) {
      // skip empty details
      continue
    }

    const row = document.createElement('tr')
    const labelCell = document.createElement('td')
    const valueCell = document.createElement('td')
    labelCell.textContent = detail.label
    valueCell.textContent = detail.value
    row.appendChild(labelCell)
    row.appendChild(valueCell)
    detailsTable.appendChild(row)
  }

  return cardElem
}
