export const toc = /* html */ `
<div class="toc" id="toc">
	<span class="toc-header">Contents</span>
	<hr />
	<nav>
		<ul class="toc-nav-list">
			<% for (const section of sections) { %>
				<li>
					<a href="#<%= section.id %>"><%= section.name %></a>
				</li>
			<% } %>
		</ul>
	</nav>
</div>
`;
