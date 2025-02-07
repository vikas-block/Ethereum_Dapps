import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VotingUI from './component/VotingUI';
import Vote from './component/Vote';
import Signup from './component/Signup';
import Login from './component/Login';
import Interface from './component/Interface';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Interface/>}/>
        <Route path="/signIn" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/voteUI" element={<VotingUI />}/>
        <Route path="/voting/:partyName/:walletAddress" element={<Vote />}/>
      </Routes>
    </Router>
  );
}

export default App;