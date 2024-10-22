export const wiki = /*html*/ `
<div class="header"></div>
<div class="main-container">
	<aside class="toc-outer">
		<div class="toc" id="toc">
			<span class="toc-header">Contents</span>
			<hr />
			<nav>
				<ul class="toc-nav-list"></ul>
			</nav>
		</div>
	</aside>

	<main class="main-content">
		<div id="main-content"></div>
	</main>

	<aside>
		<div id="side-card"></div>
	</aside>
</div>

<footer>
	<div class="dropdown-container">
		<button class="light-dark-switcher" aria-label="light and dark mode switcher" id="theme-switcher-trigger">
			<i class="bi bi-moon-stars"></i>
			<i class="bi bi-sun"></i>
			<i class="bi bi-laptop"></i>
		</button>

		<dialog class="dropdown-menu" id="theme-switcher-dialog">
			<form id="theme-switcher">
				<span>
					<input type="radio" name="theme" id="dark" value="dark" />
					<label for="dark">
						<i class="bi bi-moon-stars off"></i>
						<i class="bi bi-moon-stars-fill on"></i>
						Dark
					</label>
				</span>

				<span>
					<input type="radio" name="theme" id="light" value="light" />
					<label for="light">
						<i class="bi bi-sun off"></i>
						<i class="bi bi-sun-fill on"></i>
						Light
					</label>
				</span>

				<span>
					<input type="radio" name="theme" id="system" value="auto" />
					<label for="system">
						<i class="bi bi-laptop off"></i>
						<i class="bi bi-laptop-fill on"></i>
						System
					</label>
				</span>
			</form>
		</dialog>
	</div>
	</footer>
`;
