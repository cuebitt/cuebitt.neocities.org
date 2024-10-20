import { nanoid } from 'https://esm.sh/nanoid@5.0.7'

const defaultData = {
  version: '0.1',
  header: {
    title: 'Wikimaker',
    subtitle: 'A character wiki page builder'
  },
  card: {
    characterName: 'Character Name',
    characterImage: 'https://placehold.co/200',
    characterImageAlt: 'Placeholder Image',
    details: [
      { label: 'Species', value: 'Domestic Cat', id: nanoid() },
      { label: 'Coat Color', value: 'Black', id: nanoid() }
    ]
  },
  mainContent: [
    {
      type: 'text',
      heading: 'About',
      content: 'Welcome to WikiMaker! To begin editing, press the `Escape` key to open the menu.'
    },
    {
      type: 'text',
      heading: 'Done?',
      content: 'When you\'re finished, press the "Generate HTML" button to get the HTML code for your page.'
    }
  ]
}

export function loadPersistentValues () {
  return JSON.parse(window.localStorage.getItem('wikimakerData')) || defaultData
}

export function savePersistentValues (data) {
  window.localStorage.setItem('wikimakerData', JSON.stringify(data))
}
