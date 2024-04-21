const fpcalc = require('fpcalc');
const { keccak256 } = require('js-sha3');

let fingerprint;

async function getFingerprint(song) {
	try {
		const result = await new Promise((resolve, reject) => {
			fpcalc(song, (err, res) => {
				if (err) reject(err);
				resolve(res);
			});
		});

		fingerprint = result.fingerprint;
		console.log(fingerprint);

		const hashedFingerprint = keccak256(fingerprint);
		console.log(hashedFingerprint);

		return hashedFingerprint;
	} catch (error) {
		console.error(error);
	}
}

module.exports = getFingerprint;
