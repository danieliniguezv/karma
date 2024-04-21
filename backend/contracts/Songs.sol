//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.25;

contract Songs {
	address public developerAddress;

	mapping(string => address) public songOwner;
	mapping(string => uint256) public price;
	mapping(address => mapping(string => bool)) public permit;

	modifier onlyOwner {
		if (msg.sender == developerAddress) {
			_;
		}
	}

	event AddressChanged(address indexed _newAddress);
	event SongBought(address indexed _buyer, string _song);
	event PriceChanged(address indexed _changer, uint256 _price);
	event PermitGiven(address indexed _pemitted);

	constructor(address _developerAddress) {
		developerAddress = _developerAddress;
	}

	function updateDeveloperAddress(address _newDeveloperAddress) public onlyOwner {
		developerAddress = _newDeveloperAddress;
		emit AddressChanged(developerAddress);
	}

	function uploadSong(string memory _audioFingerprintHash, uint256 _price) public {
		bool _permit = false;
		price[_audioFingerprintHash] = _price;
		songOwner[_audioFingerprintHash] = msg.sender;
		_setPermit(_audioFingerprintHash, _permit);
	}

	function buySong(string memory _audioFingerprintHash) public payable {
		address payable _artistAddress = payable(songOwner[_audioFingerprintHash]);
		uint256 _developerFee = _fee(msg.value);
		uint256 _artistEarnings = msg.value - _developerFee;

		if (msg.value == price[_audioFingerprintHash]) {
			_setPermit(_audioFingerprintHash, true);
			(bool _sent, bytes memory _data) = payable(developerAddress).call{value: _developerFee}("");
			(_sent, _data) = _artistAddress.call{value: _artistEarnings}("");
			emit SongBought(msg.sender, _audioFingerprintHash);
		} else {
			revert("Not enough money!");
		}
	}

	function setPrice(string memory _audioFingerprintHash, uint256 _price) public {
		if (songOwner[_audioFingerprintHash] == msg.sender) {
			price[_audioFingerprintHash] = _price;
			emit PriceChanged(msg.sender, price[_audioFingerprintHash]);
		} else {
			revert("No can do!");
		}
	}

	function _setPermit(string memory _audioFingerprintHash, bool _permit) internal {
		if (songOwner[_audioFingerprintHash] == msg.sender) {
			permit[msg.sender][_audioFingerprintHash] = true;
			emit PermitGiven(msg.sender);
		} else {
			permit[msg.sender][_audioFingerprintHash] = _permit;
			emit PermitGiven(msg.sender);
		}
	}

	function _fee(uint256 _songPrice) public pure returns (uint256 _developerFee) {
        _developerFee = (_songPrice / 100) * 3;
        return _developerFee;
    }
}