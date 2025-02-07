import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DigitalABI from "./DigitalABI.json";
import VoteABI from "./Vote.json" // Import the ABI
import './vote.css'; // Custom CSS if needed
import { useParams } from "react-router-dom"; 

const DigitalIdentitySystem_ABI = DigitalABI;
const DigitalIdentitySystem_ADDRESS = "0x263331607cd71f565f9A2701dC4AAC7A09B8A9AA";
const Vote_ABI = VoteABI;
const Vote_ADDRESS ="0xd854640d5723dC126E5e786500d589a46793eA32";
const Voting = () => {
  const { partyName, walletAddress } = useParams();
  console.log(walletAddress,"sgdf");
  const [userInfo, setUserInfo] = useState({
    name: "",
    walletAddress: "",
    dob: "",
    isValid: false,
  });
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    if (walletAddress) {
      fetchUserInfo(walletAddress);
    }
  }, [walletAddress]);

  const fetchUserInfo = async (walletAddress) => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(
  DigitalIdentitySystem_ABI,
  DigitalIdentitySystem_ADDRESS
  );

  try {
    const claim = await contract.methods
      .getPersonalInfoClaim(walletAddress)
      .call();
    console.log(claim);
    
    const date = new Date(Number(claim[2]) * 1000).toLocaleDateString();
    console.log("asdasd", date)
    console.log("IS VALID", claim[3]);
    setUserInfo({
      name: claim[0], 
      userAddress: claim[1],
      dob: date, 
      isValid: claim[3], 
    });
    } catch (error) {
      console.error("Error fetching user info:", error);
      alert("Error fetching user information from blockchain.");
    } 
  };

 async function setVoterInfo(userInfo){
    
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }
    function getAge(DOB){
      var birthdate = new Date(DOB);
      var now = new Date();
      var age = now.getFullYear() - birthdate.getFullYear();
      if (now.getMonth() < birthdate.getMonth() || (now.getMonth() === birthdate.getMonth() && now.getDate() < birthdate.getDate())) {
        age--;
      }  
      return age;
    }
   
    const isValidAge= getAge(userInfo.dob);
    console.log("Age: " + isValidAge);
    if(isValidAge<=18){
      alert("You must be above 18 to vote");
      return;
    }

    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(
      Vote_ABI,
      Vote_ADDRESS
    );
    try {
      console.log(typeof(userInfo.dob)); 
      console.log(`date: ${userInfo.dob}`); 
      const [day, month, year] = userInfo.dob.split('/');
      const formattedDate = `${year}-${month}-${day}`;
      const dobTimestamp = new Date(formattedDate).getTime();
      if (isNaN(dobTimestamp)) {
        throw new Error('Invalid date format');
      }
      console.log(`dobTimestamp: ${dobTimestamp}`);

      if (!userInfo.name || !userInfo.isValid || !partyName) {
        throw new Error('All required fields must be filled');
      }
      const _hasVoted= contract.methods.hasVoted(userInfo.userAddress);
      if(_hasVoted){
        alert("You have already voted");
        return;
      }
      const vote = await contract.methods
          .setVoterDetails(userInfo.userAddress, userInfo.name, userInfo.userAddress,dobTimestamp,partyName)
          .send({ from: userInfo.userAddress });
      alert("You are vote is submitted");
      console.log("VOTE", vote);
      } catch (error) {
        console.error("Error fetching user info:", error);
        alert("Error fetching user information from blockchain.");
      } 

  }
  const handleVoteClick = () => {
    setVoterInfo(userInfo);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
   <>
    <div className="wallet-div" >
        <p>wallet Address : {walletAddress}</p>
    </div>
    <div className="voting">
      <h1>User Details</h1>
      <div className="user-details">
        <p>
          <strong>Name:</strong> {userInfo.name}
        </p>
        <p>
          <strong>Address:</strong> {userInfo.userAddress}
        </p>
        <p>
          <strong>DOB:</strong> {userInfo.dob}
        </p>
        <p>
          <strong>Is Valid For Vote:</strong> {userInfo.isValid?"yes":"no"}
        </p>
      </div>
      <button className="vote-button" onClick={handleVoteClick}>
        Vote to {partyName} party
      </button>
      {showPopup && (
        <div className="popup">
          <p>Thanks for Vote</p>
        </div>
      )}
  </div>
   </>
  );
};

export default Voting;
