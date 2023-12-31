import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  let admin = JSON.parse(localStorage.getItem("authorization"));

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, `${admin.adminTypeName}`, data.chatId),
      (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      },
    );

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className='messages'>
      {messages.map((m, index) => (
        <Message
          message={m}
          key={m.id}
          isLatest={index === messages.length - 1}
        />
      ))}
    </div>
  );
};

export default Messages;
