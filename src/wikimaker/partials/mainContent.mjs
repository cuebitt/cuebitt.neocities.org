import { micromark } from "https://esm.sh/micromark@3";
import { gfm, gfmHtml } from "https://esm.sh/micromark-extension-gfm@3?bundle";
import DOMPurify from "https://esm.sh/dompurify@3.1.7";

// Templates for each type of main content section
export const textSection = /* html */ `
<section class="main-section">
    <a class="section-anchor" id="<%= it.id %>">
      <h1><%= it.heading %></h1>
    </a>
    <hr />
    <div class="section-body"><%~ it.transform(it.content) %></div>
  </section>
`;

// biome-ignore lint/style/noUnusedTemplateLiteral: Todo: complete implementation
const slideshowSection = /* html */ ``;

// biome-ignore lint/style/noUnusedTemplateLiteral: Todo: complete implementation
const colorPaletteSection = /* html */ ``;

// biome-ignore lint/style/noUnusedTemplateLiteral: Todo: complete implementation
const singleImageSection = /* html */ ``;

// Main content column
export const mainContent = /*html*/ `
<% it.sections.forEach((section) => { %>
  <% if (section.type === "text") { %>
    <%~ include("@textSection", {...section, transform: it.transform}) %>
  <% } %>
   <% }) %>
`;
