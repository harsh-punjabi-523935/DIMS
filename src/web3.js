import { ethers } from "ethers";
import contractABI from "./UnifiedIdentityABI.json"; // Import the ABI file

const contractAddress = "0x9ba0cd7c30f900d7862fd5d1a4115bb0ea99f063"; // Replace with actual contract address

// Connect to Ethereum
const getEthereumContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }
  console.log("Using Contract Address:", contractAddress);

  const provider = new ethers.BrowserProvider(window.ethereum); // Fix Web3Provider issue
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract.connect(signer);
};

export { getEthereumContract };
