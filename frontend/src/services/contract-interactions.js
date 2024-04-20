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
