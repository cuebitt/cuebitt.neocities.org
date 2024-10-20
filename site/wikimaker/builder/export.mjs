import * as prettier from 'https://esm.sh/prettier@3.3.3'
import parserHtml from 'https://esm.sh/prettier@3.3.3/plugins/html'
import parserCSS from 'https://esm.sh/prettier@3.3.3/plugins/postcss'
import parserBabel from 'https://esm.sh/prettier@3.3.3/plugins/babel'
import parserEstree from 'https://esm.sh/prettier@3.3.3/plugins/estree'
import init, { transform } from 'https://esm.sh/lightningcss-wasm'

async function processCSS (css) {
  // Optimize CSS with LightningCSS
  await init()
  const { code } = transform({
    code: new TextEncoder().encode(css)
  })

  // Format optimized CSS with Prettier
  return await prettier.format(TextDecoder().decode(code), {
    parser: 'css',
    plugins: [parserCSS]
  })
}

async function inlineLinked (htmlDocument) {
  const inlineElems = Array.from(htmlDocument.querySelectorAll('link[rel=stylesheet][data-inline], script[data-inline]'))
    .map(async (elem) => {
      if (elem.tagName === 'LINK') {
        const response = await fetch(elem.href)
        const text = await response.text()
        const cssProcessed = await processCSS(text)

        const style = document.createElement('style')
        style.textContent = cssProcessed
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

export async function exportHTML () {
  // Clone the document
  const exportHTML = document.documentElement.cloneNode(true)

  // Remove unnecessary elements
  exportHTML.querySelector('.remove-from-generated').remove() // Remove the builder menu
  exportHTML.querySelectorAll('script:not(#theme-switcher-script') // any scripts that aren't the theme switcher
    .forEach((script) => script.remove())
  exportHTML.querySelector('base').remove() // base tag
  exportHTML.querySelector('link[href="builder/builder.css"]').remove() // builder css
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
