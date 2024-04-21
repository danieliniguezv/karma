import { ethers } from 'ethers';
import { songs } from '../contracts/songs.js';

export async function UploadSong(signer, acousticFingerprintHash, price) {
	const songsSmartContractAddress = process.env.SONGS_SMART_CONTRACT_ADDRESS;
	const songsSmartContract = new ethers.Contract(songsSmartContractAddress, songs, signer);

	const txUpload = await songsSmartContract.uploadSong(acousticFingerprintHash, price);
	await txUpload.wait();

	return txUpload.hash;
}

export async function GetPermit(signer, userAddress, acousticFingerprintHash) {
	const songsSmartContractAddress = process.env.SONGS_SMART_CONTRACT_ADDRESS;
	const songsSmartContract = new ethers.Contract(songsSmartContractAddress, songs, signer);

	const permit = await songsSmartContract.permit(userAddress, acousticFingerprintHash);

	return permit;
}

export async function GetPrice(signer, acousticFingerprintHash) {
	const songsSmartContractAddress = process.env.SONGS_SMART_CONTRACT_ADDRESS;
	const songsSmartContract = new ethers.Contract(songsSmartContractAddress, songs, signer);

	const price = await songsSmartContract.price(acousticFingerprintHash);

	return price;
}

export async function BuySong(signer, acousticFingerprintHash, userAddress, price) {
	const parsedAmount = ethers.parseUnits(price.toString(), 18);
	const songsSmartContractAddress = process.env.SONGS_SMART_CONTRACT_ADDRESS;
	const songsSmartContract = new ethers.Contract(songsSmartContractAddress, songs, signer);

	const txBuySong = await songsSmartContract.buySong(acousticFingerprintHash, {value: price});
	await txBuySong.wait();
	const txHash = txBuySong.hash;

	const permit = await songsSmartContract.permit(userAddress, acousticFingerprintHash);

	return { txHash, permit };
}
