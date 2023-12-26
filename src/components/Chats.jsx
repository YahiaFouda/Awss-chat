import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChatContext } from "../context/ChatContext";
import User from "../assets/img/user.png";

import { db } from "../firebase";
const Chats = () => {
  const [isSelected, setIsSelected] = useState(false);

  const [chats, setChats] = useState([]);

  const { authorization: currentUser } = useSelector(
    (state) => state.authorization,
  );
  let admin = JSON.parse(localStorage.getItem("authorization"));

  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = async () => {
      const unsubscribe = onSnapshot(
        collection(db, admin.adminTypeName),
        (querySnapshot) => {
          let arr = [];
          querySnapshot.forEach((doc) => {
            let obj = doc.data();
            obj.documentId = doc.id;
            arr.push(obj);
          });
          setChats(arr);
          // handleSelect(Object.entries(arr)?.sort(sortByDateDesc)[0][1]);
        },
      );

      // Clean up the subscription when the component unmounts or when the user changes
      return () => unsubscribe();
    };

    currentUser.id && getChats();
  }, [currentUser.id]);

  // useEffect(() => {
  //   // handleSelect(Object.entries(chats)?.sort(sortByDateDesc)[0][1]);

  // //   const getChats = async() => {
  // //     let arr=[]
  // //     const querySnapshot = await getDocs(collection(db,`${admin.adminTypeName}` ));
  // //     querySnapshot.forEach((doc) => {
  // //      let obj=doc.data()
  // //      obj.documentId=doc.id
  // //       arr.push(obj)
  // //     });
  // //     setChats(arr);
  // //     handleSelect(Object.entries(arr)?.sort(sortByDateDesc)[0][1])
  // //   };

  // //   currentUser.id && getChats();
  // }, [currentUser.id]);
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setIsSelected(u.documentId);
    updateDoc(doc(db, `${admin.adminTypeName}`, u.documentId), {
      unReadMessagesCountFromAdmin: 0,
      unReadMessagesCountFromUser: 0,
    });
  };

  function sortByDateDesc(a, b) {
    return new Date(b[1].lastMessageDate) - new Date(a[1].lastMessageDate);
  }
  return (
    <div className='chats'>
      {Object.entries(chats)
        ?.sort(sortByDateDesc)
        .map((chat) => {
          return (
            //chat[1].documentId==isSelected?
            <div
              className={
                chat[1].documentId == isSelected
                  ? "userChatSelected"
                  : "userChat"
              }
              key={chat[0]}
              onClick={() => {
                handleSelect(chat[1]);
              }}
            >
              <div>
                <img src={User} alt='' />
              </div>
              <div className='userChatInfo'>
                <span>{chat[1].name}</span>
                <p>
                  {chat[1]
                    ? chat[1].lastMessage
                      ? chat[1].lastMessage.length > 20
                        ? `${chat[1].lastMessage.substring(1, 20)} ....`
                        : chat[1].lastMessage
                      : ""
                    : ""}
                </p>
              </div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                  alignSelf: "flex-end",
                  fontSize: "1.2rem",
                  lineHeight: "0",
                  color: "#2f2d52",
                }}
              >
                {chat[1].unReadMessagesCountFromUser &&
                chat[1].unReadMessagesCountFromUser > 0 ? (
                  <span
                    className=''
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      backgroundColor: "#F44336",
                      height: "1.4rem",
                      width: "1.4rem",
                      borderRadius: "9999px",
                      padding: " .48rem .48rem",
                      color: "white",
                      // marginLeft: "6rem",
                    }}
                  >
                    {" "}
                    {chat[1].unReadMessagesCountFromUser > 9
                      ? "+9"
                      : chat[1].unReadMessagesCountFromUser}
                  </span>
                ) : (
                  ""
                )}
              </span>
            </div>
            //   :

            //     <div
            //       className="userChat"
            //       key={chat[0]}
            //       onClick={() =>{
            //         handleSelect(chat[1])
            //       }
            //       }
            //     >
            //       <img src={User} alt="" />
            //       <div className="userChatInfo">
            //       <span>{chat[1].name}{chat[1].unReadMessagesCountFromUser&&chat[1].unReadMessagesCountFromUser>0?<span style={{color:"red"}}> ({chat[1].unReadMessagesCountFromUser})</span>:""}</span>
            //       <p>{chat[1]?chat[1].lastMessage?chat[1].lastMessage.length>20?`${chat[1].lastMessage.substring(1,20)} ....`:chat[1].lastMessage:"":""}</p>
            // </div>
            //     </div>
          );
        })}
    </div>
  );
};

export default Chats;
