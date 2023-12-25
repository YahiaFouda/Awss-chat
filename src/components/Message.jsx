import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { ChatContext } from "../context/ChatContext";
import Admin from "../assets/img/admin.png";
import User from "../assets/img/user.png";
import { type } from "../config";
import File from "../assets/img/File.png";

const Message = ({ message }) => {
  const { authorization: currentUser } = useSelector(
    (state) => state.authorization,
  );
  const { data } = useContext(ChatContext);
  var name = message.message.split("*")[1];
  if (name) {
    name = name.split("?")[0];
  }
  console.log("name", name);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  let date;
  if (message.date) {
    date = moment(message.date).calendar();
  } else {
    date = moment().calendar();
  }
  return (
    <div ref={ref} className={`message ${message.adminId && "owner"}`}>
      <div className={`${message.adminId ? "messageInfo" : "messageInfoUser"}`}>
        <img src={message.adminId ? Admin : User} alt='' />
      </div>
      <div className='messageContent'>
        {message.type == type.image ? (
          <a
            href={message.message}
            target='_blank'
            style={{
              display: "block",
              backgroundColor: "#8da4f1",
              padding: "3px",
              borderRadius: "5px",
              paddingBottom: "0",
            }}
          >
            <img src={message.message} alt='' />
          </a>
        ) : message.type == type.video || message.type == type.audio ? (
          <video src={message.message} controls />
        ) : message.type == type.file ? (
          <a href={message.message} target='_blank'>
            <img className='imgFile' src={File} alt='' />
            {name}
          </a>
        ) : (
          <div style={{ position: "relative" }}>
            <p>{message.message}</p> <span>{date}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
