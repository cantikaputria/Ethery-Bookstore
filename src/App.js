import React, { useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Penerbit from './Penerbit';
import Tokobuku from './Tokobuku';
import Konsumen from './Konsumen';

function App() {
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
      "name": "Productred",
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
  

  // Inisialisasi provider Web3.js dengan Metamask
  useEffect(() => {
    const sendLogToSQL = async (eventKey, eventData) => {
      try {
        const response = await axios.post('http://localhost:3001/log', { eventKey, eventData });
        console.log('Log sent to SQL:', response.data);
      } catch (error) {
        console.error('Failed to send log to SQL:', error);
      }
    };

    const connectToContract = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          const contract = new web3.eth.Contract(contractABI, contractAddress);

          // Listen to ProductAdded event
          contract.events.ProductAdded({}, (error, event) => {
            if (!error) {
              const eventData = {
                id: event.returnValues.id,
                name: event.returnValues.name,
                description: event.returnValues.description,
                owner: event.returnValues.owner,
              };
              sendLogToSQL('ProductAdded', eventData);
            } else {
              console.error('Error listening to ProductAdded event:', error);
            }
          });
        } catch (error) {
          console.error('Failed to connect to contract:', error);
        }
      } else {
        console.error('Metamask not found');
      }
    };

    connectToContract();
  }, []);

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/penerbit" component={Penerbit} />
          <Route path="/tokobuku" component={Tokobuku} />
          <Route path="/konsumen" component={Konsumen} /> 
          
        </Switch>
      </div>
    </Router>
  );
}

export default App;


//<Route path="/tokobuku" component={Tokobuku} />
//<Route path="/konsumen" component={Konsumen} />