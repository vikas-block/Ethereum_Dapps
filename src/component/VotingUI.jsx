import React from 'react';
import { Link , useLocation} from 'react-router-dom'; // Import Link from react-router-dom
import './VotingUI.css';
import bjpImage from '../pictures/Bharatiya_Janata_Party_logo.svg.png';
import congressImage from '../pictures/Indian_National_Congress_hand_logo.png';
import aapImage from '../pictures/jay.png';

const VotingUI = () => {

   const location = useLocation();
   const walletAddress = location?.state.walletAddress; // Get the wallet address from the confirmation page
   const userAddress = location?.state.userAddress; // Get the user address from the
  
   console.log("dtrr", userAddress);
  
   const parties = [
    { name: 'BJP', image: bjpImage },
    { name: 'Congress', image: congressImage },
    { name: 'AAP', image: aapImage },
  ];

  return (
    <>
    <div className='wallet-address'>
      <p>Wallet Address: {walletAddress}</p>
    </div>
    <div className="voting-ui">
      <h1>INDIAN VOTING DAPP</h1>
      <h2>State: MP</h2>
      <h3>Parties for voting</h3>
      <div className="party-cards">
        {parties.map((party, index) => (
          <div key={index} className="party-card">
            <img src={party.image} alt={party.name} className="party-image" />
            {/* Use Link to navigate to Voting component with party name as a parameter */}
             <Link to={`/voting/${party.name}/${walletAddress}`} className="party-link">
              {party.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default VotingUI;