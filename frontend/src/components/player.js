export default class PlayerComponent {
	constructor(page) {
		this.innerHTML = `
				<div id="player">
            <img id="album-art" src="#" alt="Album Art">
            <div id="song-info">
                <h2 id="song-title"></h2>
                <p id="artist"></p>
            </div>
            <audio id="audio-player" controls>
                <source src="#" type="audio/mpeg">
            </audio>
            <input id="progress-bar" type="range" value="0" min="0" max="100" step="1">
            <div class="volume-container">
                <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="1">
            </div>
            <div class="control-buttons">
                <button id="previous-button" class="control-button"><i class="fas fa-backward"></i></button>
                <button id="play-pause-button" class="control-button"><i class="fas fa-play"></i></button>
                <button id="next-button" class="control-button"><i class="fas fa-forward"></i></button>
            </div>
        </div>
        <div id="playlist">
            <!-- List of songs will be dynamically generated here -->
        </div>
		`;
	}
	render() {
		return this.innerHTML;
	}
}
