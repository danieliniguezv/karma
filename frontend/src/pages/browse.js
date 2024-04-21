const songsFetch = JSON.parse(localStorage.getItem('songs'));

// Songs object.
const songs  = songsFetch.map(song => {
  return {
    acousticFingerprintHash: song.acousticFingerprintHash,
    title: song.title,
    artist: song.artist,
    audioFile: `../${song.audioFile.split('/').slice(-3).join('/')}`,
    albumArt: `../${song.albumArt.split('/').slice(-3).join('/')}`,
    price: song.price
  };
});

console.log(songs);

// Get references to the HTML elements
const songListContainer = document.getElementById('song-list-container');
/*
const songTitleElement = document.getElementById('song-title');
const artistElement = document.getElementById('artist');
const albumArtElement = document.getElementById('album-art');
*/

// Add event listener to load the first track when the page is loaded.
document.addEventListener('DOMContentLoaded', () => {
});

function formatDuration(duration) {
  let minutes = Math.floor(duration / 60);
  let seconds = Math.round(duration % 60);

  // Pad the numbers with leading zeros if necessary
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  return minutes + ':' + seconds;
}

async function getSongDuration(songUrl) {
  return new Promise(function(resolve, reject) {
    let audio = new Audio(songUrl);

    audio.addEventListener('loadedmetadata', function() {
      let duration = audio.duration;
      let formattedDuration = formatDuration(duration);
      resolve(formattedDuration);
    });

    audio.addEventListener('error', function() {
      reject(audio.error);
    });

    audio.load();
  });
}


// Function to generate the playlist.
function generatePlaylist() {
  const listAttribute = ['art','artist-name', 'song-name', 'duration', 'price', 'buy']
	for (let i = 0; i < songs.length; i++) {
		const song = songs[i];
    const row = document.createElement('ul');
    row.classList.add('song-info');
    row.setAttribute('id', `song-list-${i}`)
    /*
    const listItem = document.createElement('li');
    listItem.textContent = song.artist + " - " + song.title;
    */
		songListContainer.appendChild(row);

    for (let j = 0; j < 6; j++) {
      const listItem = document.createElement('li');
      listItem.setAttribute('id', `${listAttribute[j]}-${i}`);
      const songListElement = document.getElementById(`song-list-${i}`);
      songListElement.appendChild(listItem);
      if ( j == 0) {
        let art = document.createElement('img')
        art.setAttribute('id', `album-art-${i}`);
        listItem.appendChild(art);
        document.getElementById(`album-art-${i}`).src = song.albumArt;
        document.getElement
      } else if (j == 1) {
        listItem.textContent = song.artist;
      } else if (j == 2) {
        listItem.textContent = song.title;
      } else if (j == 3) {
        const duration = async () => {
          try {
            let songDuration = null;
            songDuration = await getSongDuration(song.audioFile);
            console.log('Song duration:', songDuration);
            listItem.textContent = songDuration;
          } catch (error) {
            console.error('Error loading song:', error);
          }
        }
        duration();
      } else if (j == 4) {
        listItem.textContent = song.price/1e18 + ' SHD';
      } else if (j == 5) {
        let button = document.createElement('div');
        button.classList.add('button');
        button.setAttribute('data-page', 'browse');
        button.setAttribute('id', 'buy-button');
        button.innerHTML = `<p>Buy</p >`;
        listItem.appendChild(button);
      }
    }
	}
}
/*
    const songRow = document.createElement('ul');
    songRow.classList.add('song-info');
    const listItem = document.createElement('li');
    */

// Generate the playlist
generatePlaylist();
