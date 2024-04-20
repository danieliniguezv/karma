import { LoginWindowText } from './components/text.js';
import { Connect } from './services/wallet-interactions.js';
import { TextElement } from './components/dashboard.js';
import LogInComponent from './components/login.js';
import UploadComponent from './components/upload.js';
import PlayerComponent from './components/player.js';
import { songs } from './contracts/songs.js';
import { UploadSong, GetPermit } from './services/contract-interactions.js';

const currentPage = document.body.getAttribute('data-page');

let userAddress = null;

document.addEventListener('DOMContentLoaded', async () => {
	userAddress = localStorage.getItem('userAddress');
	if (userAddress) {
		await Connect();
	}
	console.log(userAddress);
});

window.ethereum.on('accountsChanged', (accounts) => {
	if (accounts.length === 0) {
		localStorage.removeItem('userAddress');
		window.location.reload();
	}
	// localStorage.setItem('userAddress', accounts[0]);
	// window.location.reload();
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
			//localStorage.setItem('userAddress', signer.address);
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
			localStorage.setItem('userAddress', signer.address);
			
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
/* File uploading */
/*if (currentPage === 'upload') {
	const uploadComponent = new UploadComponent(currentPage);
	document.getElementById('upload-component').appendChild(uploadComponent.render());

	const uploadButton = document.getElementById('upload-button');
	const fileInput = document.createElement('input');
	fileInput.type = 'file';

	fileInput.addEventListener('change', async (event) => {
		event.preventDefault();

		const file = fileInput.files[0];
		const artist = document.getElementById('artist-name').value;
		const song = document.getElementById('song-name').value;
		const genre = document.getElementById('genre').value;
			
		const formData = new FormData();
		formData.append('file', file);
		formData.append('artist', artist);
		formData.append('song', song);
		formData.append('genre', genre);

		try {
				const response = await fetch('/upload', {
					method: 'POST',
					body: formData
				});

			if (!response.ok) {
				throw new Error('Upload failed. Server returned ' + response.status);
			}

			const text = await response.text();
			console.log('Server response: ', text);
			console.log('File uploaded successfully!');

			fileInput.value = null;
		} catch (error) {
			console.error('Error: ', error);
		}
	});

	uploadButton.addEventListener('click', (event) => {
		event.preventDefault();
		fileInput.click();
	});
}*/

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
				const permit = await GetPermit(signer, userAddress, acousticFingerprintHash);
				console.log(permit);

				const requestBody = JSON.stringify({ permit });

				response = await fetch(`/permit/${userAddress}/permit`, {
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
	
	await fetch(`/get-songs/${userAddress}`)
		.then(response => response.json())
		.then(data => {
			songs.push(...data);
			localStorage.setItem('songs', JSON.stringify(songs));
		})
		.catch(error => {
			console.error('Error fetching songs data: ' + error);
		});
}

/* Dashboard */
if (currentPage === 'dashboard') {
	const address = TextElement(userAddress);
	document.getElementById('user-account').appendChild(address);
	const uploadButtonText = TextElement('Upload');
	document.getElementById('upload-button').appendChild(uploadButtonText);
}
