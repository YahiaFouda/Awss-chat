import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function (event) {
    navigate(1);
  };
  return (
    <div className='home'>
      <div className='container'>
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
