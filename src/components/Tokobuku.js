import React, { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';

function Tokobuku() {
  const contractAddress = '0x4f41504b4712E7cCF69B63c27Ef3204Cf35FB8ca'; // Ganti dengan alamat kontrak Anda
  
    const contractABI = [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "ProductAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "to",
              "type": "address"
            }
          ],
          "name": "ProductTransferred",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_quantity",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "isbn",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "penulis",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "penerbit",
              "type": "string"
            }
          ],
          "name": "addProduct",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            }
          ],
          "name": "getProduct",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "quantity",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "isbn",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "penulis",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "penerbit",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_addr",
              "type": "address"
            }
          ],
          "name": "getRegisteredCompanyDescription",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            }
          ],
          "name": "registerCompany",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_quantity",
              "type": "uint256"
            }
          ],
          "name": "transferProduct",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
  

  const [productId, setProductId] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferQuantity, setTransferQuantity] = useState(0);

  const handleGetProduct = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Memanggil fungsi getProduct pada smart contract
      const result = await contract.methods.getProduct(parseInt(productId)).call();
      console.log('Product:', result);
    } catch (error) {
      console.error('Failed to get product:', error);
    }
  };

  const handleTransferProduct = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Mengirim transaksi ke smart contract
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods
        .transferProduct(
          parseInt(productId),
          transferTo,
          parseInt(transferQuantity)
        )
        .send({ from: accounts[0] });

      console.log('Transaction result:', result);
    } catch (error) {
      console.error('Failed to transfer product:', error);
    }
  };

  return (
    <div>
      <h1>Halaman Toko Buku</h1>
      <div>
        <label>Product ID:</label>
        <input type="number" value={productId} onChange={(e) => setProductId(e.target.value)} />
      </div>
      <button onClick={handleGetProduct}>Get Product</button>
      <br />
      <div>
        <label>Transfer To:</label>
        <input type="text" value={transferTo} onChange={(e) => setTransferTo(e.target.value)} />
      </div>
      <div>
        <label>Transfer Quantity:</label>
        <input
          type="number"
          value={transferQuantity}
          onChange={(e) => setTransferQuantity(e.target.value)}
        />
      </div>
      <button onClick={handleTransferProduct}>Transfer Product</button>
    </div>
  );
}

export default Tokobuku;
