import { ethers } from 'ethers';

let signer = null;
let provider = null;
let connected = null;

export async function Connect() {
	if (window.ethereum == null) {
		console.log('Metamask is not installed. Using read-only defaults.');
		provider = ethers.getDefaultProvider();
	} else {
		provider = new ethers.BrowserProvider(window.ethereum);
		signer = await provider.getSigner();
		connected = window.ethereum.isConnected();

		return signer.address;
	}
}
