export default class UploadComponent {
	constructor(page) {
		this.container = document.createElement('div');
		this.container.classList.add('upload');
		this.container.setAttribute('data-page', page);
		this.container.innerHTML = `
		<div class="login" data-page="${page}"></div>
			<div class="input-fields" data-page="${page}">
				<div id="artist-input">
					<label for="artist-name">Artist:</label>
					<input type="text" name="artist-name">
				</div>
				<div id="song-name-input">
					<label for="song-name">Song Name:</label>
					<input type="text" name="song-name">
				</div>
				<div id="genre-input">
					<label for="genre">Genre:</label>
					<input type="text" name="genre">
				</div>
			</div>
			<div class=upload-buttons>
				<div class="select-song-button">
					<button id="select-song">Select Song</button>
				</div>
				<div class="select-image-button">
					<button id="select-image">Select Image</button>
				</div>
			</div>
			<div class="upload-button">
				<button id="upload-all-items">Upload</button>
			</div>
		`;
	}
	
	render() {
		return this.container;
	}
}
