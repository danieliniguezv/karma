import { LoginWindowText } from './components/login.js';
import { Connect } from './services/walletInteractions.js';
import { TextElement } from './components/dashboard.js';
import UploadComponent from './components/upload.js';

const currentPage = document.body.getAttribute('data-page');
const userAddress = localStorage.getItem('userAddress');

document.addEventListener('DOMContentLoaded', () => {
	if (userAddress) {
		Connect();
	}
});

/* Login */
if (currentPage === 'login') {
	const artistRadioButton = document.getElementById('artist-radio-button');

	const welcomeText = LoginWindowText('Welcome to Karma');
	document.getElementById('welcome-text').appendChild(welcomeText);

	const signIn = LoginWindowText('Login');
	document.getElementById('sign-in').appendChild(signIn);

	const artistOption = LoginWindowText('Artist');
	document.getElementById('artist-option').appendChild(artistOption);

	const listenerOption = LoginWindowText('Listener');
	document.getElementById('listener-option').appendChild(listenerOption);

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
