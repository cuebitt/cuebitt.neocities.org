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
      { label: 'Version', value: '0.1', id: nanoid() },
      { label: 'Created by', value: 'Cuebitt', id: nanoid() }
    ]
  },
  mainContent: [
    {
      type: 'text',
      heading: 'About',
      content: 'Welcome to WikiMaker! WikiMaker is a simple wiki page generator that produces static web pages that you can easily upload to a number of free web hosts. To begin editing, press the `Escape` key to open the menu.'
    },
    {
      type: 'text',
      heading: 'Content',
      content: `WikiMaker supports sections that contain:     
- Markdown text
- Color palettes
- Single images
- Image gallery slideshows

Any new sections you add will automatically be linked in the table of contents on the left. You can also reorder sections by dragging and dropping them in the table of contents to the left.
`
    },
    {
      type: 'text',
      heading: 'Done?',
      content: `
When you're finished, press the "Generate HTML" button to get the HTML code for your page. Your data is saved in your browsers local storage each time you click the \`Update Wiki Page\` button. All data is stored locally, so it may be lost if you clear your browser cache.

The generated web page is designed to be simple enough to be easily customized. If you want to change something that isn't supported by the builder, you can easily edit the HTML directly.

You can select an emoji to use as the favicon for the page. You may need to clear your browser cache to see the change.
`
    }
  ],
  other: {
    faviconEmoji: '🌐'
  }
}

export function loadPersistentValues () {
  const data = JSON.parse(window.localStorage.getItem('wikimakerData')) || defaultData

  return { ...data, card: { ...data.card, details: data.card.details.map(detail => ({ ...detail, id: nanoid() })) } }
}

export function savePersistentValues (data) {
  const dataRemovedId = { ...data, card: { ...data.card, details: data.card.details.map(detail => ({ label: detail.label, value: detail.value })) } }

  window.localStorage.setItem('wikimakerData', JSON.stringify(dataRemovedId))
}
