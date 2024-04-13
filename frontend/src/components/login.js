export default class LogInComponent {
	constructor(page) {
		this.container = document.createElement('div');
		this.container.classList.add('login');
		this.container.setAttribute('data-page', page);
		if (page === 'sign-up') {
			this.container.innerHTML = `
			<div class="log-in" data-page="${page}">
				<img src="../src/images/new-logo-website-1.svg" id="logo-log-in">
				<div class="welcome" id="welcome-text">
					<p>Welcome to Karma</p>
				</div>
				<div class="input-field">
					<form>
						<input type="text" id="username-form" name="username" placeholder="Username">
					</form>
				</div>
				<div class="user-selector">
					<div class="artist-selector">
						<input type="radio" id="artist-radio-button" name="user-type" checked>
						<label for="artist-radio-button" id="artist-option">
							<p>Artist</p>
						</label>
					</div>
					<div class="listener-selector">
						<input type="radio" id="listener-radio-button" name="user-type">
						<label for="listener-radio-button" id="listener-option">
							<p>Listener</p>
						</label>
					</div>
				</div>
				<div class="welcome" id="sign-up">
					<p>Sign Up</p>
				</div>
				<div class="button" id="metamask-button">
					<form id="log-in-form" method="POST">
						<img src="../src/images/metamask-button.svg" id="metamask-logo">
					</form>
				</div>
			</div>
			`;
		} else if (page === 'log-in') {
			this.container.innerHTML = `
				<div class="log-in" data-page="${page}">
					<img src="../src/images/new-logo-website-1.svg" id="logo-log-in">
					<div class="welcome" id="welcome-text">
						<p>Welcome to Karma</p>
					</div>
					<div class="welcome" id="sign-up" data-page="${page}">
						<p>Log In</p>
					</div>
					<div class="button" id="metamask-button">
						<img src="../src/images/metamask-button.svg" id="metamask-logo">
					</div>
					<div class="sign-up" id="sign-up-no-account">
						<p><a href="../public/signup.html">No Account? Sign Up!</a></p>
					</div>
				</div>
			`;
		}
	}

	render() {
		return this.container;
	}
}
