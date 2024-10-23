// putting these in the template string messes up syntax highlighting
const OPEN = "<style>";
const CLOSE = "</style>";

export const wiki = /*html*/ `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wikimaker Template</title>

    <link
      rel="shortcut icon"
      href="https://fav.farm/<%= it.other.faviconEmoji %>"
      type="image/x-icon"
      id="favicon"
    />

    <style>
      @import "https://unpkg.com/open-props@1.7.7";
      @import "https://unpkg.com/open-props@1.7.7/normalize.min.css";
      @import "https://unpkg.com/open-props@1.7.7/buttons.min.css";
      @import "https://unpkg.com/open-props/theme.light.switch.min.css";
      @import "https://unpkg.com/open-props/theme.dark.switch.min.css";
      @import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
    </style>

    ${OPEN}
      <%~ it.styles %>
    ${CLOSE}
  </head>

  <body>
    <%~ include("@header", {title: it.header.title, subtitle: it.header.subtitle}) %>

    <div class="main-container">
      <aside class="toc-outer">
        <%~ include("@toc", {sections: it.mainContent}) %>
      </aside>

      <main class="main-content">
        <%~ include("@mainContent", {sections: it.mainContent, transform: it.mdToHtml}) %>
      </main>

      <aside>
        <%~ include("@sideCard", {card: it.card}) %>
      </aside>
    </div>

    <footer></footer>
  </body>
</html>
`;
