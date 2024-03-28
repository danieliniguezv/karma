import { LoginWindowText } from './components/login.js';
import { Connect } from './services/walletInteractions.js';
import { TextElement } from './components/dashboard.js';

const currentPage = document.body.getAttribute('data-page');
const userAddress = localStorage.getItem('userAddress');

document.addEventListener('DOMContentLoaded', () => {
	if (userAddress) {
		Connect();
	}
});

/* Login */
if (currentPage === 'login') {
	const welcomeText = LoginWindowText('Welcome to Karma!');
	document.getElementById('welcome-text').appendChild(welcomeText);

	const signIn = LoginWindowText('Sign in');
	document.getElementById('sign-in').appendChild(signIn);

	const connectButton = document.getElementById('metamask-button');
	connectButton.addEventListener('click', async () => {
		try {
			const address = await Connect();
			localStorage.setItem('userAddress', address);
			if (address) {
				window.location.href = '../public/dashboard.html';
			} else {
				null;
			}
		} catch (error) {
			console.log('Error: ' + error.message);
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
