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

    <% if (it.other.includeThemeSwitcher) { %>
      <script src="https://cdn.jsdelivr.net/gh/cuebitt/webcomponents@v1.4.1/components/theme-switcher/theme-switcher.js"></script>

      <style>
      theme-switcher::part(btn) {
        padding: 0;
        border: var(--border-size-2) solid var(--surface-3);
        background: none;
        background-color: var(--surface-1);
        border-radius: 5px;
      }
      [data-theme="dark"] theme-switcher::part(btn) {
        padding: 0;
        border: none;
        background: none;
        background-color: var(--surface-3);
        border-radius: 5px;
      }

      @media (prefers-color-scheme: dark) {
        [data-theme="light"] theme-switcher::part(btn) {
          padding: 0;
          border: var(--border-size-2) solid var(--surface-3);
          background: none;
          background-color: var(--surface-1);
          border-radius: 5px;
        }

        [data-theme="auto"] theme-switcher::part(btn) {
          padding: 0;
          border: none;
          background: none;
          background-color: var(--surface-3);
          border-radius: 5px;
        }
      }
      </style>
    <% } %>
  </head>

  <body>
    <%~ include("@header", {title: it.header.title, subtitle: it.header.subtitle, includeThemeSwitcher: it.other.includeThemeSwitcher}) %>

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

    <% if (it.other.includeThemeSwitcher) { %>
      <script>
        const themeSwitcher = document.querySelector("theme-switcher");

      themeSwitcher.addEventListener("themechange", (e) => {
        document.documentElement.setAttribute(
          "data-theme",
          e.detail.theme === "system" ? "auto" : e.detail.theme
        );

        localStorage.setItem("theme", e.detail.theme);
      });

      const theme = localStorage.getItem("theme") || "system";
      document.documentElement.setAttribute(
        "data-theme",
        theme === "system" ? "auto" : theme
      );

      themeSwitcher.setAttribute("theme", theme);
      </script>
    <% } %>
  </body>
</html>
`;
