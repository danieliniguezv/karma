import { LoginWindowText } from './components/login.js';
import { Connect, AccountChanged } from './services/walletInteractions.js';
import { TextElement } from './components/dashboard.js';

let userAddress;
const currentPage = document.body.getAttribute('data-page');

AccountChanged();

document.addEventListener('DOMContentLoaded', () => {
	userAddress = localStorage.getItem('userAddress');
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
} else if (currentPage === 'dashboard') {
	const address = localStorage.getItem('userAddress');
	userAddress = TextElement(address);
	document.getElementById('user-account').appendChild(userAddress);
}
