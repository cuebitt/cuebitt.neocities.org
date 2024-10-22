export const sideCard = /* html */ `
<div class="card side-card" id="side-card">
	<header>
		<div class="card-header-name"><%= header_name %></div>
	</header>
	<div class="card-body">
		<img class="side-image" src="<%= img_src %>" alt="<%= img_alt %>" />
		<table class="side-card-table">
			<tbody class="side-card-table-body">
				<% for (const detail of details) { %>
				<tr>
					<td><%= detail.label.trim() %></td>
					<td><%= detail.value.trim() %></td>
				</tr>
				<% } %>
			</tbody>
		</table>
	</div>
</div>
`;
