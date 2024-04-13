import { LoginWindowText } from './components/text.js';
import { Connect } from './services/walletInteractions.js';
import { TextElement } from './components/dashboard.js';
import LogInComponent from './components/login.js';
import UploadComponent from './components/upload.js';

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
			fetch('http://localhost:3000/check-address?address=' + encodeURIComponent(address))
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
if (currentPage === 'upload' || currentPage === 'artist') {
	const uploadComponent = new UploadComponent(currentPage);
	document.getElementById('upload-component').appendChild(uploadComponent.render());
}

/* Dashboard */
if (currentPage === 'dashboard') {
	const address = TextElement(userAddress);
	document.getElementById('user-account').appendChild(address);
	const uploadButtonText = TextElement('Upload');
	document.getElementById('upload-button').appendChild(uploadButtonText);
}
