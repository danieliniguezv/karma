//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.25;

contract Songs {
	mapping(string => address) public songOwner;
	mapping(string => uint256) public price;
	mapping(address => mapping(string => bool)) public permit;

	function uploadSong(string memory _audioFingerprintHash, uint256 _price) public {
		bool _permit = false;
		price[_audioFingerprintHash] = _price;
		songOwner[_audioFingerprintHash] = msg.sender;
		_setPermit(_audioFingerprintHash, _permit);
	}

	function buySong(string memory _audioFingerprintHash) public payable {
		address payable _to = payable(songOwner[_audioFingerprintHash]);
		if (msg.value == price[_audioFingerprintHash]) {
			_setPermit(_audioFingerprintHash, true);
			(bool _sent, bytes memory _data) = _to.call{value: msg.value}("");
		} else {
			revert("Not enough money!");
		}
	}

	function setPrice(string memory _audioFingerprintHash, uint256 _price) public {
		if (songOwner[_audioFingerprintHash] == msg.sender) {
			price[_audioFingerprintHash] = _price;
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
