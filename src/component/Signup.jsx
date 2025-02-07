import React, { useState } from "react";
import Web3 from "web3";
import DigitalABI from "./DigitalABI.json";
import './signup.css';
import { useNavigate } from "react-router-dom";

const DigitalIdentitySystem_ABI = DigitalABI;
const DigitalIdentitySystem_ADDRESS =
  "0x263331607cd71f565f9A2701dC4AAC7A09B8A9AA"; // DigitalIdentitySystem Contract Address

const issuerPrivateKey = PRIVATE_KEY
 

const Signup = () => {
  const [name, setName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [DOB, setDOB] = useState(0); // Store DOB as a string or timestamp
  const [walletAddress, setWalletAddress] = useState("");

  const navigate = useNavigate();

  const connectMetaMask = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      setWalletAddress(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };

  const createIdentity = async (e) => {
    if(!walletAddress){
      alert("Please first connect to your wallet");
      return;
    }
    e.preventDefault();
    console.log("Creating identity");
    console.log(window.ethereum);
    const web3 = new Web3(window.ethereum);
    console.log("Creating identity2");
    const contract = new web3.eth.Contract(
      DigitalIdentitySystem_ABI,
      DigitalIdentitySystem_ADDRESS
    );
    await contract.methods
      .createIdentity(walletAddress)
      .send({ from: walletAddress });
    alert("Your vating Identity created successfully!");
    addPersonalInfoClaimCall();
  };

  const addPersonalInfoClaimCall = async () => {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        DigitalIdentitySystem_ABI,
        DigitalIdentitySystem_ADDRESS
      );

      if (
        !web3.utils.isHexStrict(issuerPrivateKey) ||
        issuerPrivateKey.length !== 66
      ) {
        throw new Error(
          "Invalid private key format. It must be a 64-character hex string."
        );
      }
      
      function getAge(){
        var birthdate = new Date(DOB);
        var now = new Date();
        var age = now.getFullYear() - birthdate.getFullYear();
        if (now.getMonth() < birthdate.getMonth() || (now.getMonth() === birthdate.getMonth() && now.getDate() < birthdate.getDate())) {
          age--;
        }  
        return age;
      }
    
      const isValidAge= getAge(DOB);
      console.log("Age: " + isValidAge);
      var age=false;
      if(isValidAge>=18){
        age=true;
      }
     const dobTimestamp = new Date(DOB).getTime() / 1000; // Unix timestamp (in seconds)

      const claimData = {
        name: name,
        userAddress: walletAddress,
        dob: dobTimestamp, // Pass DOB as a Unix timestamp
      
      };
    
      const signature = web3.eth.accounts.sign(JSON.stringify(claimData), issuerPrivateKey).signature;
      console.log("Issuer signature: " + signature);
    
      await contract.methods
        .addPersonalInfoClaim(walletAddress, name, dobTimestamp, age, signature)
        .send({ from: walletAddress });
    alert("Personal info claim added successfully!");
    navigate('/login',{
      state: {walletAddress :walletAddress} // Pass the property details to the confirmation page
    });
  };

  return (
    <div className="container">
      <h1>Welcome to Indian Voting Dapp</h1>
      <div className="Connect-button-div">
      <button className= "Connect-button"onClick={connectMetaMask}>{walletAddress?"Connected" :"Connect wallet"}</button>
      <p>Wallet Address: {walletAddress}</p>
      </div>

      <h3>Sign up</h3>
      <form className="submit-form" onSubmit={(e) => createIdentity(e)}>
        <div className="form-group">
          <strong>Address :- </strong>
          <input
            type="text"
            id="userAddress"
            name="userAddress"
            placeholder="Enter your address"
            value={walletAddress}
            onChange={(e) =>setUserAddress(e)}
          />
        </div>
        <div className="form-group">
          <strong>Name :-</strong>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <strong>DOB :-</strong>
          <input
            type="date"
            id="dob"
            name="dob"
            placeholder="Enter your Date of Birth"
            value={DOB}
            onChange={(e) => setDOB(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
