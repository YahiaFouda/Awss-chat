import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from 'moment';
import { ChatContext } from "../context/ChatContext";
import Admin from "../img/admin.png";
import User from "../img/user.png";
import {type} from "../config";
import File from "../img/File.png";

const Message = ({ message }) => {
  const {authorization:currentUser} =useSelector(state=>state.authorization)
  const { data } = useContext(ChatContext);
  var name =  message.message.split('*')[1];
  if(name){
    name=name.split("?")[0]
  }
  console.log("name",name)
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  let date
if(message.date){
  date=moment(message.date).calendar()
}
else{
  date=moment().calendar()
}
  return (
    <div
      ref={ref}
      className={`message ${message.adminId&& "owner"}`}
    >
      <div className={`${message.adminId?"messageInfo":"messageInfoUser"}`}>
      <img src={message.adminId?Admin:User} alt="" />
        <span>{date}</span>
      </div>
      <div className="messageContent">
      
      
      {message.type==type.image?<a href={message.message} target="_blank"> <img src={message.message} alt="" /></a>:(message.type==type.video||message.type==type.audio)?<video src={message.message} controls/>:message.type==type.file?<a href={message.message} target="_blank">  <img className="imgFile" src={File} alt="" />{name}</a>:<p>{message.message}</p>}
    
      </div>
    </div>
  );
};

export default Message;
