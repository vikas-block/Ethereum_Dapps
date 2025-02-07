import React from 'react'
import { Link } from 'react-router-dom'
import './interface.css';

function Interface() {
  return (
    <div className='interface-div'>
        <h1> WELCOME TO INDIAN VOTING DAPP</h1>
        <Link to={'/signIn'}>
         <button className='btn '>Sign In</button>
        </Link>
        <Link to={'/login'}>
        
        <button className='btn'>Login</button>
        </Link>
    </div>
  )
}

export default Interface
