import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';

function Penerbit() {
  const contractAddress = '0x420dF3A78F61e543E7038E5c87D1aC80C50E468D'; // Ganti dengan alamat kontrak Anda
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
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isbn, setIsbn] = useState('');
  const [penulis, setPenulis] = useState('');
  const [penerbit, setPenerbit] = useState('');
  const [registeredCompanyDescription, setRegisteredCompanyDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const accounts = await web3.eth.getAccounts();

        // Get the registered company description
        const description = await contract.methods.getRegisteredCompanyDescription(accounts[0]).call();
        setRegisteredCompanyDescription(description);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Mengirim transaksi ke smart contract
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods
        .addProduct(
          parseInt(productId),
          productName,
          productDescription,
          parseInt(quantity),
          isbn,
          penulis,
          penerbit
        )
        .send({ from: accounts[0] });

      console.log('Transaction result:', result);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleTransferProduct = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Mengirim transaksi transfer produk ke smart contract
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods
        .transferProduct(parseInt(productId), accounts[1], parseInt(quantity))
        .send({ from: accounts[0] });

      console.log('Transfer result:', result);
    } catch (error) {
      console.error('Failed to transfer product:', error);
    }
  };

  const handleGetProduct = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Mengambil data produk dari smart contract
      const product = await contract.methods.getProduct(parseInt(productId)).call();

      console.log('Product:', product);
    } catch (error) {
      console.error('Failed to get product:', error);
    }
  };

  const handleRegisterCompany = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Mengirim transaksi register company ke smart contract
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods.registerCompany(penerbit).send({ from: accounts[0] });

      console.log('Register company result:', result);
    } catch (error) {
      console.error('Failed to register company:', error);
    }
  };

  return (
    <div>
      <h2>Register Company</h2>
      <div>
        <label>Nama Penerbit:</label>
        <input type="text" value={penerbit} onChange={(e) => setPenerbit(e.target.value)} />
      </div>
      <button onClick={handleRegisterCompany}>Register Company</button>

      <h2>Tambah Produk</h2>
      <div>
        <label>Product ID:</label>
        <input type="number" value={productId} onChange={(e) => setProductId(e.target.value)} />
      </div>
      <div>
        <label>Nama Produk:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div>
        <label>Deskripsi Produk:</label>
        <input
          type="text"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Jumlah:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>
      <div>
        <label>ISBN:</label>
        <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
      </div>
      <div>
        <label>Penulis:</label>
        <input type="text" value={penulis} onChange={(e) => setPenulis(e.target.value)} />
      </div>
      <div>
        <label>Penerbit:</label>
        <input type="text" value={penerbit} onChange={(e) => setPenerbit(e.target.value)} />
      </div>
      <button onClick={handleAddProduct}>Tambah Produk</button>

      <h2>Transfer Produk</h2>
      <div>
        <label>Product ID:</label>
        <input type="number" value={productId} onChange={(e) => setProductId(e.target.value)} />
      </div>
      <div>
        <label>Jumlah Transfer:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>
      <button onClick={handleTransferProduct}>Transfer Produk</button>

      <h2>Dapatkan Produk</h2>
      <div>
        <label>Product ID:</label>
        <input type="number" value={productId} onChange={(e) => setProductId(e.target.value)} />
      </div>
      <button onClick={handleGetProduct}>Dapatkan Produk</button>
    </div>
  );
}

export default Penerbit;
