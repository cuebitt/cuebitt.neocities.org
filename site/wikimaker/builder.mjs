import { micromark } from 'https://esm.sh/micromark@3'
import DOMPurify from 'https://esm.sh/dompurify@3.1.7'
import * as prettier from 'https://esm.sh/prettier@3.3.3'
import parserHtml from 'https://esm.sh/prettier@3.3.3/plugins/html'
import parserCSS from 'https://esm.sh/prettier@3.3.3/plugins/postcss'
import parserBabel from 'https://esm.sh/prettier@3.3.3/plugins/babel'
import parserEstree from 'https://esm.sh/prettier@3.3.3/plugins/estree'
import { gfm, gfmHtml } from 'https://esm.sh/micromark-extension-gfm@3?bundle'

const testData = {
  card: {
    characterName: 'Indigo',
    imgSrc: 'https://placehold.co/200',
    imgAlt: 'Placeholder image',
    details: [
      { label: 'Species', value: 'Holy Cow' },
      { label: 'Pronouns', value: 'He/Him' }
    ]
  },
  main: {
    sections: [
      {
        type: 'text',
        heading: 'Background',
        content: 'Indigo was hit and killed by the [Isekai Truck](https://en.wikipedia.org/wiki/Truck-kun) one day and [got flewed out](https://www.youtube.com/shorts/gD1zzRw9yoE) into the furry afterlife. Being dead doesn\'t seem to bother him, though.'
      },
      {
        type: 'text',
        heading: 'Background',
        content: '![test](https://placehold.co/200)'
      }
    ]
  },
  header: {
    title: 'Wikimaker',
    subtitle: 'A character wiki page builder'
  }
}

function constructRightCard (data) {
  const cardElem = document.getElementById('right-card-template').content.cloneNode(true)

  // Set values
  cardElem.querySelector('.card-header-name').textContent = data.characterName
  const img = cardElem.querySelector('.side-image')
  img.src = data.imgSrc
  img.alt = data.imgAlt

  const detailsTable = cardElem.querySelector('.side-card-table-body')
  for (const detail of data.details) {
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

// <a href="http://" target="_blank" rel="noopener noreferrer"></a>
function constructTextSection (header, content, id) {
  const sectionElem = document.getElementById('body-text-section-template').content.cloneNode(true)

  // Hydrate
  sectionElem.querySelector('.section-anchor').id = id // if there are duplicate headings, ensure the id is unique
  sectionElem.querySelector('.section-anchor > h1').textContent = header

  sectionElem.querySelector('.section-body').innerHTML = DOMPurify.sanitize(micromark(content, { plugins: [gfm()], htmlExtensions: [gfmHtml] }))
  sectionElem.querySelectorAll('.section-body a').forEach((a) => {
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
  })

  return sectionElem
}

function constructMainContent (data) {
  const sections = new Map()

  for (const section of data.main.sections) {
    let id = section.heading.trim().toLowerCase()

    if (sections.has(id)) {
      let idSuffix = 1
      id = `${id}${idSuffix}`

      while (sections.has(id)) {
        idSuffix++
        id = `${id}${idSuffix}`
      }
    }

    switch (section.type) {
      case 'text':
        sections.set(id, constructTextSection(section.heading, section.content, id))
        break
      default:
        console.error(`Unknown section type: ${section.type}`)
    }
  }

  return Array.from(sections).map(([key, value]) => {
    return {
      id: key,
      name: value.querySelector('.section-anchor > h1').textContent,
      elem: value
    }
  })
}

function constructToc (mainContent) {
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

function constructHeader (data) {
  const headerElem = document.getElementById('header-template').content.cloneNode(true)

  headerElem.querySelector('hgroup h1').textContent = data.title
  headerElem.querySelector('hgroup h2').textContent = data.subtitle

  return headerElem
}

function hydratePage (data) {
  // Generate the main sections
  const mainContent = constructMainContent(testData)
  const mainFragment = document.createDocumentFragment()
  for (const section of mainContent) {
    mainFragment.appendChild(section.elem)
  }

  // Generate the other sections and insert them into the DOM
  document.querySelector('.main-content').appendChild(mainFragment)
  document.getElementById('side-card').replaceWith(constructRightCard(testData.card))
  document.querySelector('#toc').replaceWith(constructToc(mainContent))
  document.querySelector('.header').replaceWith(constructHeader(testData.header))

  // Set the document title
  document.title = `${data.card.characterName} - ${data.header.title}`
}

async function inlineLinked (htmlDocument) {
  const inlineElems = Array.from(htmlDocument.querySelectorAll('link[rel=stylesheet][data-inline], script[data-inline]'))
    .map(async (elem) => {
      if (elem.tagName === 'LINK') {
        const response = await fetch(elem.href)
        const text = await response.text()

        const style = document.createElement('style')
        style.textContent = await prettier.format(text, {
          parser: 'css',
          plugins: [parserCSS]
        })
        elem.replaceWith(style)
      } else if (elem.tagName === 'SCRIPT') {
        const response = await fetch(elem.src)
        const text = await response.text()

        const script = document.createElement('script')
        script.textContent = await prettier.format(text, {
          parser: 'babel',
          plugins: [parserBabel, parserEstree]
        })
        elem.replaceWith(script)
      }
    })

  await Promise.all(inlineElems)
}

async function exportHTML () {
  // Clone the document
  const exportHTML = document.documentElement.cloneNode(true)

  // Remove unnecessary elements
  exportHTML.querySelector('.remove-from-generated').remove() // Remove the builder menu
  exportHTML.querySelectorAll('script:not(#theme-switcher-script') // any scripts that aren't the theme switcher
    .forEach((script) => script.remove())
  exportHTML.querySelector('base').remove() // base tag
  exportHTML.querySelector('link[href="builder.css"]').remove() // builder css
  exportHTML.querySelectorAll('style').forEach((style) => { style.remove() }) // any stray style tags

  // Inline linked resources (css and theme switcher script)
  await inlineLinked(exportHTML)

  // Format the HTML Document
  const formattedHTML = await prettier.format(exportHTML.outerHTML, {
    parser: 'html',
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    plugins: [parserHtml]
  })

  // Download the file
  const downloader = document.createElement('a')
  const blob = new Blob([formattedHTML], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  downloader.style.display = 'none'
  downloader.href = url
  downloader.download = 'wiki.html'

  document.body.appendChild(downloader)
  downloader.click()
  document.body.removeChild(downloader)

  URL.revokeObjectURL(url)
}

let menuOpen = false

function setupBuilderMenu () {
  document.getElementById('generate-html-btn').addEventListener('click', () => {
    exportHTML()
  })

  document.addEventListener('keypress', function onEvent (event) {
    if (event.key === 'Escape') {
      menuOpen = !menuOpen
      if (menuOpen) {
        document.getElementById('builder-dialog').showModal()
      }
    }
  })
}

setupBuilderMenu()
hydratePage(testData)
