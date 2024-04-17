//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.25;

contract Songs {
	string public audioFingerprintHash;
	uint256 public price;

	mapping(string => address) public songOwner;
	mapping(address => mapping(string => bool)) public permit;

	function uploadSong(string memory _audioFingerprintHash, uint256 _price) public {
		bool _permit = false;
		price = _price;
		audioFingerprintHash = _audioFingerprintHash;
		songOwner[_audioFingerprintHash] = msg.sender;
		_setPermit(_audioFingerprintHash, _permit);
	}

	function buySong(string memory _audioFingerprintHash, address payable _to) public payable {
		if (msg.value == price) {
			_setPermit(_audioFingerprintHash, true);
			(bool _sent, bytes memory _data) = _to.call{value: msg.value}("");
		} else {
			revert("Not enough moiney!");
		}
	}

	function setPrice(uint256 _price, string memory _audioFingerprintHash) public {
		if (songOwner[_audioFingerprintHash] == msg.sender) {
			price = _price;
		} else {
			revert("No can do!");
		}
	}

	function _setPermit(string memory _audioFingerprintHash, bool _permit) internal {
		if (songOwner[_audioFingerprintHash] == msg.sender) {
			permit[msg.sender][_audioFingerprintHash] = true;
		} else {
			permit[msg.sender][_audioFingerprintHash] = _permit;
		}
	}
}
