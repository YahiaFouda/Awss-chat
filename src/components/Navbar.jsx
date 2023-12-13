import React, { useContext } from 'react'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { Navigate, useNavigate } from "react-router-dom";
import { logout } from '../redux/Authorization';

const Navbar = () => {
  const navigate = useNavigate();

  const {authorization:currentUser} =useSelector(state=>state.authorization)
  const dispatch = useDispatch();
const logOutAdmin=()=>{
  dispatch(logout(null))
  navigate("/login")

}
  return (
    <div className='navbar'>
      <span className="logo">AWSS Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.fullName}</span>
        <button onClick={logOutAdmin}>logout</button>
      </div>
    </div>
  )
}

export default Navbar