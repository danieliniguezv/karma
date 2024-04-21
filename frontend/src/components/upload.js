export default class UploadComponent {
	constructor(page) {
		this.container = document.createElement('div');
		this.container.classList.add('upload');
		this.container.setAttribute('data-page', page);
		this.container.innerHTML = `
		<div class="log-in" data-page="${page}">
			<img src="../src/images/new-logo-website-1.svg" id="logo-log-in" data-page="${page}">
		</div>
			<div class="input-fields" data-page="${page}">
				<div class="input-field">
					<label for="artist-name">Artist:</label>
					<input type="text" id="artist-name" name="artist-name">
				</div>
				<div class="input-field">
					<label for="song-name">Song Name:</label>
					<input type="text" id="song-name" name="song-name">
				</div>
				<div class="input-field">
					<label for="genre">Genre:</label>
					<input type="text" id="genre" name="genre">
				</div>
				<div class="input-field">
					<label for="price">Price:</label>
					<input type="text" id="price" name="price">
				</div>
			</div>
			<div class=upload-buttons data-page="${page}">
				<div class="button" id="select-song-button" data-page="${page}">
					<p>Select Song</p>
				</div>
				<div class="button" id="select-image-button" data-page="${page}">
					<p>Select Image</p>
				</div>
			</div>
			<div class="button disabled" id="upload-button">
				<p>Upload</p>
			</div>
		`;
	}
	
	render() {
		return this.container;
	}
}
