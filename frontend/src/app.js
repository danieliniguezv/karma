import { LoginWindowText } from './components/text.js';
import { Connect } from './services/wallet-interactions.js';
import { TextElement } from './components/dashboard.js';
import LogInComponent from './components/login.js';
import UploadComponent from './components/upload.js';
import PlayerComponent from './components/player.js';
import { songs } from './contracts/songs.js';
import { UploadSong, GetPermit, GetPrice, BuySong } from './services/contract-interactions.js';

const currentPage = document.body.getAttribute('data-page');

let userAddress = null;
let signerUser = null;

document.addEventListener('DOMContentLoaded', async () => {
	userAddress = localStorage.getItem('userAddress');
	if (userAddress) {
		signerUser = await Connect();
	}
	console.log(userAddress);
});

window.ethereum.on('accountsChanged', (accounts) => {
	if (accounts.length === 0) {
		localStorage.removeItem('userAddress');
		window.location.reload();
	}
	if (signerUser) {
		window.location.reload();
	}
});

/* Log In component for Log In and Sign Up page */
if (currentPage === 'log-in' || currentPage === 'sign-up') {
	const logInComponent = new LogInComponent(currentPage);
	document.getElementById('log-in-component').appendChild(logInComponent.render());
}

/* Log In Page */
if (currentPage === 'log-in') {
	const connectButton = document.getElementById('metamask-button');

	connectButton.addEventListener('click', async () => {
		try {
			const signer  = await Connect();
			console.log(signer.address);
			fetch('/check-address?address=' + encodeURIComponent(signer.address))
				.then(response => { 
					return response.text()
				})
				.then(result => {
					console.log(result);
					if (`${result}` === 'Address exists in the database.') {
						window.location.href = 'player.html';
					} else {
						window.alert('Please sign up and create an account!');
						window.location.href = 'signup.html';
					}
				});
		} catch (error) {
			console.log('Error: ' + error.message);
		}
	});
}

/* Sign Up Page */
if (currentPage === 'sign-up') {
	const artistRadioButton = document.getElementById('artist-radio-button');
	const listenerRadioButton = document.getElementById('listener-radio-button');
	const signUpButton = document.getElementById('metamask-button');

	let username = null;
	let userType = null;

	signUpButton.addEventListener('click', async () => {
		try {
			username = document.getElementById('username-form').value;
			if (!username) {
				throw new Error('Please choose and input a username!');
			}
			const signer = await Connect();
			// localStorage.setItem('userAddress', signer.address);
			
			if (artistRadioButton.checked) {
				userType = 'Artist';
			} else {
				userType = 'Listener';
			}

			const formData = new FormData();
			formData.append('address', signer.address);
			formData.append('username', username);
			formData.append('userType', userType);

			try {
				const response = await fetch('/sign-up', {
					method: 'POST',
					body: formData
				});

				if (!response.ok) {
					throw new Error('Upload failed. Server returned: ' + response.status);
				}

				const text = await response.text();
				console.log('Server response: ', text);
				if (userType === 'Artist') {
					window.location.href = 'upload.html';
				} else if (userType === 'Listener') {
					window.location.href = 'player.html';
				}

				username = null;
				userType = null;
			} catch (error) {
				console.error('Error: ', error);
			}
		} catch (error) {
			window.alert('Error: ' + error.message);
			console.log('Error: ' + error.message);
		}
	});
}

/* Upload Component for upload and artist page */
if (currentPage === 'artist') {
	const uploadComponent = new UploadComponent(currentPage);
	document.getElementById('upload-component').appendChild(uploadComponent.render());
}

if (currentPage === 'upload') {
	const uploadComponent = new UploadComponent(currentPage);
	document.getElementById('upload-component').appendChild(uploadComponent.render());
	console.log(userAddress);

	const selectSongButton = document.getElementById('select-song-button');
	const selectImageButton = document.getElementById('select-image-button');
	const uploadButton = document.getElementById('upload-button');

	const fileInput = document.createElement('input');
	fileInput.type = 'file';

	let songFile = null;
	let imageFile = null;

	selectSongButton.addEventListener('click', (event) => {
		event.preventDefault();
		fileInput.accept = 'audio/*';
		fileInput.click();
	});

	selectImageButton.addEventListener('click', (event) => {
		event.preventDefault();
		fileInput.accept = 'image/*';
		fileInput.click();
	});

	fileInput.addEventListener('change', (event) => {
		event.preventDefault();

		const file = fileInput.files[0];
		if (fileInput.accept === 'audio/*') {
			songFile = file;
		} else if (fileInput.accept === 'image/*') {
			imageFile = file;
		}

		fileInput.value = null;

		if (songFile && imageFile) {
			uploadButton.classList.remove('disabled');
		}
	});

	uploadButton.addEventListener('click', async (event) => {
		event.preventDefault();
		let response = null;
		let formData = null;

		const signer = await Connect();

		const artist = document.getElementById('artist-name').value;
		const song = document.getElementById('song-name').value;
		const genre = document.getElementById('genre').value;
		const price = document.getElementById('price').value;
		console.log(signer.address);

		formData = new FormData();
		formData.append('songFile', songFile);
		formData.append('imageFile', imageFile);
		formData.append('artist', artist);
		formData.append('songName', song);
		formData.append('genre', genre);
		formData.append('price', price);
		formData.append('userAddress', signer.address);

		try {
			response = await fetch('/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed. Server returned: ' + response.status);
			}

			const data = await response.json();
			const acousticFingerprintHash = data.acousticFingerprint;
			console.log('Acoustic Fingerprint: ', acousticFingerprintHash);
			
			console.log('Files uploaded successfully!');

			songFile = null;
			imageFile = null;
			uploadButton.classList.add('disabled');

			try {
				const txUploadHash = await UploadSong(signer, acousticFingerprintHash, price);
				console.log(`Upload successful! tx hash: ${txUploadHash}`);
				response = null;
			} catch (error) {
				console.error('Error: ', error);
			}
			try {
				const permit = await GetPermit(signer, signer.address, acousticFingerprintHash);
				console.log(permit);

				const requestBody = JSON.stringify({ acousticFingerprintHash, permit });

				response = await fetch(`/permit/${userAddress}/acousticFingerprintHash/permit`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: requestBody
				});

				if (!response.ok) {
					throw new Error('Error inserting permit: ' + response.status);
				}
				console.log('Permit set.');
			} catch (error) {
				console.error('Error: ', error);
			}
		} catch (error) {
			console.error('Error: ', error);
		}
	});
}

/* Player Page */
if (currentPage === 'player' ) {
	userAddress = localStorage.getItem('userAddress');
	const songs = [];
	await fetch(`/permits/${userAddress}`)
		.then(response => response.json())
		.then(data => {
			songs.push(...data);
			localStorage.setItem('songs', JSON.stringify(songs));
			console.log(songs);
		})
		.catch(error => {
			console.error('Error fetching songs data: ' + error);
		});

}

/* Browse Page */
if (currentPage === 'browse') {
	const signer = await Connect();
	localStorage.removeItem('songs');
	let songs = [];

	await fetch('/get-songs')
		.then(response => response.json())
		.then(data => {
			songs.push(...data);
			console.log(songs);
			localStorage.setItem('songs', JSON.stringify(songs));
		})
		.catch(error => {
			console.error('Error fetching songs data: ' + error);
		});

	const songsFetch = JSON.parse(localStorage.getItem('songs'));

	// Songs object.
	songs  = songsFetch.map(song => {
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
	async function generateSonglist() {
		let button;
		let acousticFingerprintHash;
		let buttonMap = {};
		let songPrice = {};

		const listAttribute = ['art','artist-name', 'song-name', 'duration', 'price', 'buy']

		for (let i = 0; i < songs.length; i++) {
			const song = songs[i];
			const row = document.createElement('ul');
			row.classList.add('song-info');
			row.setAttribute('id', `song-list-${i}`)
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
					listItem.textContent = song.price/1e18 + ' SHM';
				} else if (j == 5) {
					button = document.createElement('div');
					button.classList.add('button');
					button.setAttribute('data-page', 'browse');
	  				button.innerHTML = `<p>Buy</p >`;
					button.setAttribute('id', `buy-button-${i}`);
					listItem.appendChild(button);
					let buttonId = button.id;
					buttonMap[buttonId]  = song.acousticFingerprintHash;
					songPrice[song.acousticFingerprintHash] = song.price;
				}
			}
		}
		let buttons = document.querySelectorAll('.button');
		
		let sellerAddress = '0xD257004Eb47caD68d8523944d66c064b235863b6';

		buttons.forEach(button => {
			button.addEventListener('click', async () => {
				try {
					const signer  = await Connect();
					console.log(signer.address);
					fetch('/check-address?address=' + encodeURIComponent(signer.address))
						.then(response => { 
							return response.text()
						})
						.then(async result => {
							console.log(result);
							if (`${result}` === 'Address exists in the database.') {
								let buttonId = button.id;
								acousticFingerprintHash = buttonMap[buttonId];
								console.log('Buy song: ' + acousticFingerprintHash + '. Price: ' + songPrice[acousticFingerprintHash]);

								const { buySong, permit } = await BuySong(signer, acousticFingerprintHash, signer.address, songPrice[acousticFingerprintHash]);
								console.log(`Song bought! txHash: ${buySong}`);
								console.log(`Permit set to: ${permit}`);
								try {
									const requestBody = JSON.stringify({ acousticFingerprintHash, permit });
									const response = await fetch(`/permit/${signer.address}/acousticFingerprintHash/permit`, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json'
										},
										body: requestBody
									});

									if (!response.ok) {
										throw new Error('Error inserting permit: ' + response.status);
									}
									console.log('Permit set.');
								} catch (error) {
									console.error('Error: ' + response.status);
								}
							} else {
								window.alert('Please sign up and create an account!');
								window.location.href = 'signup.html';
							}
						});
				} catch (error) {
					console.log('Error: ' + error.message);
				}
			});
		});
	}

	// Generate the song list.
	generateSonglist();
}

/* Dashboard */
if (currentPage === 'dashboard') {
	const signer = await Connect();
	localStorage.removeItem('songs');
	let songs = [];

	await fetch(`/permits/${userAddress}`)
		.then(response => response.json())
		.then(data => {
			songs.push(...data);
			localStorage.setItem('songs', JSON.stringify(songs));
			console.log(songs);
		})
		.catch(error => {
			console.error('Error fetching songs data: ' + error);
		});

	const songsFetch = JSON.parse(localStorage.getItem('songs'));

	// Songs object.
	songs  = songsFetch.map(song => {
		return {
			acousticFingerprintHash: song.acousticFingerprintHash,
			title: song.song_name,
			artist: song.artist_name,
			audioFile: `../${song.song_file_path.split('/').slice(-3).join('/')}`,
			albumArt: `../${song.image_file_path.split('/').slice(-3).join('/')}`,
			price: song.price
		};
	});

	console.log(songs);

	// Get references to the HTML elements
	const songListContainer = document.getElementById('song-list-container');

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
	async function generateSonglist() {
		let button;
		let acousticFingerprintHash;
		let buttonMap = {};

		const listAttribute = ['art','artist-name', 'song-name', 'duration', 'price', 'buy']

		for (let i = 0; i < songs.length; i++) {
			const song = songs[i];
			const row = document.createElement('ul');
			row.classList.add('song-info');
			row.setAttribute('id', `song-list-${i}`)
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
				}
			}
		}
	}

	// Generate the song list.
	generateSonglist();
}
