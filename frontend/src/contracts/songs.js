export const songs = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_developerAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_newAddress",
				"type": "address"
			}
		],
		"name": "AddressChanged",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_audioFingerprintHash",
				"type": "string"
			}
		],
		"name": "buySong",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_pemitted",
				"type": "address"
			}
		],
		"name": "PermitGiven",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_changer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "PriceChanged",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_audioFingerprintHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "setPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_song",
				"type": "string"
			}
		],
		"name": "SongBought",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newDeveloperAddress",
				"type": "address"
			}
		],
		"name": "updateDeveloperAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_audioFingerprintHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "uploadSong",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "developerAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "permit",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "price",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "songOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
