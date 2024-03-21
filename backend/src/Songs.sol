//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.25;

contract Songs {
	bytes32 public audioFingerprintHash;

	mapping(address => mapping(bytes32 => bool)) public permit;

	function uploadSong(string memory _audioFingerprint) public {
		_setPermit(_audioFingerprint);
	}

	function _setPermit(string memory _audioFingerprint) internal {
		permit[msg.sender][_setAudioFingerprintHash(_audioFingerprint)] = false;
	}

	function _setAudioFingerprintHash(string memory _audioFingerprint) internal returns (bytes32 _audioFingerprintHash) {
		audioFingerprintHash = keccak256(bytes32(_audioFingerprint));
		return audioFingerprintHash;
	}
}
