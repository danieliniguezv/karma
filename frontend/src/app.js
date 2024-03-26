import { LoginWindowText } from './components/login.js';
import { Connect } from './services/walletInteractions.js';

const welcomeText = LoginWindowText('Welcome to Karma!');
document.getElementById('welcome-text').appendChild(welcomeText);

const signIn = LoginWindowText('Sign in');
document.getElementById('sign-in').appendChild(signIn);

const connectButton = document.getElementById('metamask-button');
connectButton.addEventListener('click', async () => {
	try {
		const userAddress = await Connect();
		console.log(userAddress);

		if (userAddress) {
			window.location.href = '../public/dashboard.html';
		} else {
			null;
		}
	} catch (error) {
		console.log('Error: ' + error.message);
	}
});
