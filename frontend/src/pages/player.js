const songsFetch = JSON.parse(localStorage.getItem('songs'));

// Songs object.
const songs  = songsFetch.map(song => {
  return {
    title: song.title,
    artist: song.artist,
    audioFile: `../${song.audioFile.split('/').slice(-3).join('/')}`,
    albumArt: `../${song.albumArt.split('/').slice(-3).join('/')}`
  };
});

console.log(songs);

// Get references to the HTML elements
const playlistElement = document.getElementById('playlist');
const songTitleElement = document.getElementById('song-title');
const artistElement = document.getElementById('artist');
const albumArtElement = document.getElementById('album-art');
const audioPlayerElement = document.getElementById('audio-player');
const progressBarElement = document.getElementById('progress-bar');
const volumeSliderElement = document.getElementById('volume-slider');
const playPauseButton = document.getElementById('play-pause-button');
const nextButton = document.getElementById('next-button');
const previousButton = document.getElementById('previous-button');

// Song index
let currentSongIndex = 0;
let mouseDownOnSlider = false;

// Add event listener to load the first track when the page is loaded.
document.addEventListener('DOMContentLoaded', function() {
	volumeSliderElement.value = 0.5;
  audioPlayerElement.volume = 0.5;
  loadFirstTrack();
});

// Function to load the first track when the page loads.
function loadFirstTrack() {
	const firstTrack = songs[0];
	loadSong(firstTrack);
}

// Function to get the file name from a URL.
function getFileName(url) {
	return url.substring(url.lastIndexOf('/') + 1);
}

// Function to load a song.
function loadSong(song) {
	songTitleElement.textContent = song.title;
	artistElement.textContent = song.artist;
	albumArtElement.src = song.albumArt;
	audioPlayerElement.src = song.audioFile;
	currentSongIndex = songs.indexOf(song);
}

// Function to generate the playlist.
function generatePlaylist() {
	for (let i = 0; i < songs.length; i++) {
		const song = songs[i];
    const listItem = document.createElement('li');
    listItem.textContent = song.artist + " - " + song.title;
    listItem.addEventListener('click', () => {
			playSong(song);
		});
		playlistElement.appendChild(listItem);
	}
}

// Function to play or pause the song
function togglePlay() {
	if (audioPlayerElement.paused) {
		audioPlayerElement.play();
  } else {
		audioPlayerElement.pause();
  }
  document.activeElement.blur();
}

// Function to play a song.
function playSong(song) {
	songTitleElement.textContent = song.title;
	artistElement.textContent = song.artist;
	albumArtElement.src = song.albumArt;
	audioPlayerElement.src = song.audioFile;
	currentSongIndex = songs.indexOf(song);
	audioPlayerElement.play();
}

// Function to play the next song.
function playNextSong() {
	currentSongIndex = (currentSongIndex + 1) % songs.length;
	const nextSong = songs[currentSongIndex];
	playSong(nextSong);
	document.activeElement.blur();
}

// Function to play the previous song.
function playPreviousSong() {
	currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
	const previousSong = songs[currentSongIndex];
	playSong(previousSong);
	document.activeElement.blur();
}

// Function to update the volume bar and audio player's volume
function updateVolume() {
	const volume = volumeSliderElement.value;
  audioPlayerElement.volume = volume;
}

// Add event listener ro toggle play with spacebar.
window.addEventListener('keydown', (e) => {
	if (e.code === 'Space') {
		togglePlay();
	}
});

// Add event listener to play next song when the current song ends.
audioPlayerElement.addEventListener('ended', playNextSong);

// Add event listener to update the volume bar and audio player's volume.
volumeSliderElement.addEventListener('input', updateVolume);

// Add event listener to update the seek bar.
audioPlayerElement.addEventListener('loadeddata', () => {
	progressBarElement.value= 0;
});

audioPlayerElement.addEventListener('timeupdate', () => {
	if (!mouseDownOnSlider) {
		progressBarElement.value = (audioPlayerElement.currentTime / audioPlayerElement.duration) * 100;
	}
});

progressBarElement.addEventListener('change', () => {
	audioPlayerElement.currentTime = (audioPlayerElement.duration || 0) * (progressBarElement.value / 100);
});

progressBarElement.addEventListener('mousedown', () => {
	mouseDownOnSlider = true;
});

progressBarElement.addEventListener('mouseup', () => {
	mouseDownOnSlider = false;
});

// Add event listeners to the play/pause, next, and previous buttons.
playPauseButton.addEventListener('click', togglePlay);

nextButton.addEventListener('click', playNextSong);

previousButton.addEventListener('click', playPreviousSong);

// Generate the playlist
generatePlaylist();
