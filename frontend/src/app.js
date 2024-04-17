import { LoginWindowText } from './components/text.js';
import { Connect } from './services/walletInteractions.js';
import { TextElement } from './components/dashboard.js';
import LogInComponent from './components/login.js';
import UploadComponent from './components/upload.js';
import { uploadFile } from './components/upload-file.js';

const currentPage = document.body.getAttribute('data-page');
const userAddress = localStorage.getItem('userAddress');

document.addEventListener('DOMContentLoaded', () => {
	if (userAddress) {
		Connect();
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
			const address = await Connect();
			console.log(address);
			fetch('/check-address?address=' + encodeURIComponent(address))
				.then(response => { 
					return response.text()
				})
				.then(result => {
					console.log(result);
					if (`${result}` === 'Address exists in the database.') {
					window.location.href = 'player.html';
					} else {
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
	const connectButton = document.getElementById('metamask-button');

	connectButton.addEventListener('click', async () => {
		try {
			const username = document.getElementById('username-form').value;
			if (!username) {
				throw new Error('Please choose and input a username!');
			}
			const address = await Connect();

			localStorage.setItem('userAddress', address);
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

		const artist = document.getElementById('artist-name').value;
		const song = document.getElementById('song-name').value;
		const genre = document.getElementById('genre').value;

		const formData = new FormData();
		formData.append('songFile', songFile);
		formData.append('imageFile', imageFile);
		formData.append('artist', artist);
		formData.append('songName', song);
		formData.append('genre', genre);

		try {
			const response = await fetch('/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed. Server returned: ' + response.status);
			}
			
			const text = await response.text();
			console.log('Server response: ', text);
			console.log('Files uploaded successfully!');

			songFile = null;
			imageFile = null;
			uploadButton.classList.add('disabled');
		} catch (error) {
			console.error('Error: ', error);
		}
	});
}

/* Dashboard */
if (currentPage === 'dashboard') {
	const address = TextElement(userAddress);
	document.getElementById('user-account').appendChild(address);
	const uploadButtonText = TextElement('Upload');
	document.getElementById('upload-button').appendChild(uploadButtonText);
}
