const contractAddress = "0x751eF8548876eb35128b64720Db457B7dD40f250"; // Replace with your contract address
const abi = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_email", "type": "string" },
      { "internalType": "uint256", "name": "_id", "type": "uint256" }
    ],
    "name": "addUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUser",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let contract;

async function connectToBlockchain() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);
      console.log("Contract connected:", contract);
    } catch (error) {
      alert("Error connecting to MetaMask: " + error.message);
    }
  } else {
    alert("Please install MetaMask!");
  }
}

async function ensureConnected() {
  if (!contract) {
    await connectToBlockchain();
  }
}

// Add User Function
async function addUser() {
  await ensureConnected();
  
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const id = document.getElementById("id").value;

  try {
    const tx = await contract.addUser(name, email, id);
    await tx.wait();
    alert("User added successfully!");
  } catch (error) {
    alert("Error adding user: " + error.message);
  }
}

// Get User Function
async function getUser() {
  await ensureConnected();
  
  try {
    const user = await contract.getUser();
    document.getElementById("userInfo").innerText = `Name: ${user[0]}, Email: ${user[1]}, ID: ${user[2]}`;
  } catch (error) {
    alert("Error fetching user data: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", connectToBlockchain);
document.getElementById("addUserButton").onclick = addUser;
document.getElementById("getUserButton").onclick = getUser;
