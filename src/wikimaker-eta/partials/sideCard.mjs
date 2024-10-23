export const sideCard = /* html */ `
<div class="card side-card" id="side-card">
    <header>
      <div class="card-header-name"><%= it.card.name %></div>
    </header>
    <div class="card-body">
      <img
        class="side-image"
        src="<%= it.card.imageUrl %>"
        alt="<%= it.card.imageAlt %>"
      />
      <table class="side-card-table">
        <tbody class="side-card-table-body">
          <% for (const detail of it.card.details) { %>
          <tr>
            <td><%= detail.label %></td>
            <td><%= detail.value %></td>
          </tr>
          <% } %>
        </tbody>
      </table>
    </div>
  </div>
`;
