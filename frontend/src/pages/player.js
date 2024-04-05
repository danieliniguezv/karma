// Songs object.
const songs = [{},{}];

// Get references to the HTML elements.
const playlistElement = document.getElementById('playlist');
const songTitleElement = document.getElementById('song-title');
const artistElement = document.getElementById('artist');
const albumArtElement = document.getElementById('album-art');
const audioPlayerElement = document.getElementById('audio-player');
const progressBarElement = document.getElementById('progress-bar');
const volumeSliderElement = document.getElementById('volume-slider');
const previousButton = document.getElementById('previous-button');
const playPauseButton = document.getElementById('play-pause-button');
const nextButton = document.getElementById('next-button');

// Song index.
let currentSongIndex = 0;
let mouseDownOnSlider = false;

// Add event listener to load the first track when the page is loaded.
document.addEventListener('DOMContentLoaded', function() {
	volumeSliderElement.value = 0.5;
	audioPlayerElement.value = 0.5;
	loadFirstTrack();
});

// Function to load the first track when the page loads.
function loadFirstTrack() {
	const firstTrack = songs[0];
	loadSong(firstTrack);
}

// Function to get the filename from a URL.
function getFilename(url) {
	return url.substring(url.lastIndexOf('/') + 1);
}

// Function to load a song.
function loadSong(song) {
	artistElement.textContent = song.artist;
	songTitleElement.textContent = song.title;
	albumArtElement.src = song.AlbumArt;
	audioPlayerElement.src = song.audioFile;
	currentSongIndex = songs.indexOf(song);
}

// Function to generate the playlist.
function generatePlaylist() {
	for (let i = 0; i < songs.length; i++) {
		const song = songs[i];
		const listItem = document.createElement('li');
		listItem.textContent = song.artist + '-' + song.title;
		listItem.addEventListener('click', () => {
			playSong(song);
		});
		playlistElement.appendChild(listItem);
	}
}

// Function to play or pause the song.
function togglePlay() {
	if (audioPlayerElement.paused) {
		audioPlayerElement.play();
	} else {
		audioPlayerElement.pause();
	}
	document.activeElement.blur();
}

// Function to play the song.
function playSong(song) {
	artistElement.textContent = song.artist;
	songTitleElement.textContent = song.title;
	albumArtElement.src = song.albumArt;
	audioPlayerElement.src = song.audioFile;
	currentSongIndex = songs.indexOf(song);
	audioPlayerElement.play();
}

// Function to play the next song.
function playNextsong() {
	currentSongIndex = (currentSongIdex + 1) % songs.length;
	const nextSong = songs[currentSongIndex];
	playSong(nextSong);
	document.activeElement.blur();
}
