import { Header, MainContent, Toc, RightCard } from '../components/index.mjs'
import { exportHTML } from './export.mjs'
import { loadPersistentValues, savePersistentValues } from './storage.mjs'
import { nanoid } from 'https://esm.sh/nanoid@5.0.7'

// Input data elements
const pageTitleInput = document.getElementById('page-title-input')
const pageSubtitleInput = document.getElementById('page-subtitle-input')

function hydratePage (data) {
  // Generate the main sections
  const mainContent = MainContent(data.mainContent)
  const mainFragment = document.createDocumentFragment()
  for (const section of mainContent) {
    mainFragment.appendChild(section.elem)
  }

  // Generate the other sections and insert them into the DOM
  document.querySelector('.main-content').appendChild(mainFragment)
  document.getElementById('side-card').replaceWith(RightCard(data.card.characterName, data.card.characterImage, data.card.characterImageAlt, data.card.details))
  document.querySelector('#toc').replaceWith(Toc(mainContent))
  document.querySelector('.header').replaceWith(Header(data.header.title, data.header.subtitle))

  // Set the document title
  document.title = `${data.card.characterName} - ${data.header.title}`
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

  document.getElementById('close-dialog-btn').addEventListener('click', () => {
    document.getElementById('builder-dialog').close()
    menuOpen = false
  })

  // setup details table
  // temp
  for (let i = 0; i < 3; i++) {
    document.querySelector('#details-table tbody').append(
      document.getElementById('details-entry-template').content.cloneNode(true)
    )
  }

  document.getElementById('update-page-btn').addEventListener('click', () => {
    hydratePage()
  })
}

// Details table in the builder menu
const detailsTableItems = [
  { label: 'Species', value: 'Holy Cow', id: nanoid() },
  { label: 'Pronouns', value: 'He/Him', id: nanoid() }
]

const wikiData = loadPersistentValues()
setupBuilderMenu()
hydratePage(wikiData)
