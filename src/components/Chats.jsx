import {collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChatContext } from "../context/ChatContext";
import User from "../img/user.png";

import { db } from "../firebase";
const Chats = () => {
  const [isSelected, setIsSelected] = useState(false);
  
  const [chats, setChats] = useState([]);

  const {authorization:currentUser} =useSelector(state=>state.authorization)
  let admin=JSON.parse(localStorage.getItem('authorization'))


  const { dispatch } = useContext(ChatContext);
  useEffect(() => {
    const getChats = async() => {
      let arr=[]
      const querySnapshot = await getDocs(collection(db,`${admin.adminTypeName}` ));
      querySnapshot.forEach((doc) => {
       let obj=doc.data()
       obj.documentId=doc.id
        arr.push(obj)
      });
      setChats(arr);
      handleSelect(Object.entries(arr)?.sort(sortByDateDesc)[0][1])
    };

    currentUser.id && getChats();
  }, [currentUser.id]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setIsSelected(u.documentId);
  };
  function sortByDateDesc(a, b) {
   return new Date(b[1].lastMessageDate) - new Date(a[1].lastMessageDate);
  }
  return (
    <div className="chats">
      
      {Object.entries(chats)?.sort(sortByDateDesc).map((chat) => {
        
        return (chat[1].documentId==isSelected? 
        <div
        className="userChatSelected"
        key={chat[0]}
        onClick={() =>{
          handleSelect(chat[1])
        }
        }
      >
        <img src={User} alt="" />
        <div className="userChatInfo">
          <span>{chat[1].name}{chat[1].unReadMessagesCountFromUser&&chat[1].unReadMessagesCountFromUser>0?<span style={{color:"red"}}> `({chat[1].unReadMessagesCountFromUser})`</span>:""}</span>
          <p>{chat[1]?chat[1].lastMessage?chat[1].lastMessage.length>20?`${chat[1].lastMessage.substring(1,20)} ....`:chat[1].lastMessage:"":""}</p>
        </div>
      </div>:
      
        <div
          className="userChat"
          key={chat[0]}
          onClick={() =>{
            handleSelect(chat[1])
          }
          }
        >
          <img src={User} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].name}</span>
            <p>{chat[1]?chat[1].lastMessage?chat[1].lastMessage.length>20?`${chat[1].lastMessage.substring(1,20)} ....`:chat[1].lastMessage:"":""}</p>
          </div>
        </div>
)})}
    </div>
  );
};

export default Chats;
