import { micromark } from 'https://esm.sh/micromark@3'
import DOMPurify from 'https://esm.sh/dompurify@3.1.7'
import { gfm, gfmHtml } from 'https://esm.sh/micromark-extension-gfm@3?bundle'

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

// color:
// {color: '#000000', location: 'Nose'}
function constructColorPaletteSection (header, colors, id) { // eslint-disable-line no-unused-vars

}

// images:
// [{src: 'https://placehold.co/200', alt: 'Placeholder image', artist: 'artistname', date: ''}]
function constructImageGallerySection (header, images, id) { // eslint-disable-line no-unused-vars
}

// image:
// {src: 'https://placehold.co/200', alt: 'Placeholder image', artist: 'artistname', date: ''}
function constructSingleImageSection (header, image, id) { // eslint-disable-line no-unused-vars
}

export function MainContent (mainSections) {
  const sections = new Map()

  for (const section of mainSections) {
    let id = section.heading.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')

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
