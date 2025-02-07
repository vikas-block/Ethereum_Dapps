import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import DigitalABI from './DigitalABI.json';
import { useNavigate , useLocation} from 'react-router-dom'; 


const DigitalIdentitySystem_ABI = DigitalABI;
const DigitalIdentitySystem_ADDRESS = "0x263331607cd71f565f9A2701dC4AAC7A09B8A9AA"; // DigitalIdentitySystem Contract Address

const Login= () => {
  const [userAddress, setUserAddress] = useState('');
  const location = useLocation();
  const [walletAddress2, setWalletAddress2] = useState("");
  const navigate = useNavigate();
  console.log("walletAddress ;", location)

  useEffect(() => {
    if(location?.state?.walletAddress){
      setWalletAddress2(location?.state.walletAddress);
    }
    // setWalletAddress2(location?.state.walletAddress);
  }, [location])
  
  const connectMetaMask = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      setWalletAddress2(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };

  const verifyLogin = async (e) => {
      if(!walletAddress2){
        alert("Please first connect to your wallet");
        return;
      }
    e.preventDefault();
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(DigitalIdentitySystem_ABI, DigitalIdentitySystem_ADDRESS);
    const result = await contract.methods.verifyPersonalInfo(userAddress).call();
    console.log(result);
   
    if(result){
      alert("User verified.. Welcome")
      navigate('/voteUI', { state: { walletAddress: walletAddress2, userAddress: userAddress } });
    }else{
      alert("Wrong user OR age under 18");
      navigate('/signIn');
    }
};

  return (
    <div className="container">
    <h1>Welcome to Indian Voting Dapp</h1>
      <div className="Connect-button-div">
      {!walletAddress2 ?(
         <div>
              <button className= "Connect-button"onClick={connectMetaMask}>{walletAddress2?"Connected" :"Connect wallet"}</button>
              <p>Wallet Address: {walletAddress2}</p>
         </div>
      ):(
      <p>Wallet Address: {walletAddress2}</p>
      )}
      </div>
      <h3>Login</h3>
      <form onSubmit={(e)=>verifyLogin(e)}>
        <div className="form-group">
          <label htmlFor="userAddress">Address</label>
          <input
            type="text"
            id="userAddress"
            name="userAddress"
            placeholder="Enter your address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
