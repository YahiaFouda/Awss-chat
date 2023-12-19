import React, { useContext, useEffect, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import {type} from "../config"
import moment from 'moment';

import { Alert, Space, Spin } from 'antd';
import ClipLoader from "react-spinners/ClipLoader";

import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytesResumable,getStorage } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const { data } = useContext(ChatContext);

  useEffect(() => {

    const unsubscribe = listenToUserCount(data.chatId, (newCount) => {
      setCount(newCount);
      
    });

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, []);

  const {authorization:currentUser} =useSelector(state=>state.authorization)
  let admin=JSON.parse(localStorage.getItem('authorization'))


  const handleSend = async (e) => {
    let updatedCount = count + 1;
    console.log("updatedCount",updatedCount)
     console.log("data.chatId",data.chatId)
    let size=e.size/1000000
    if(size>16){
      alert("sorry,maximum size is 16mb")
    }
    else{
    let etype=e.type.split('/')[0]
   if (etype=="image") {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${uuid()}`);
      const uploadTask = uploadBytesResumable(storageRef, e);
      uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    setLoading(true)
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
      console.log('File available at', downloadURL);
      await updateDoc(doc(db, `${admin.adminTypeName}`, data.chatId), {
                messages: arrayUnion({
                  adminId:currentUser.id,
                  message: downloadURL,
                  date: moment(Timestamp.now().toDate()).format(),
                  type:type.image
                }),
                lastMessage:"Image",
                lastMessageDate: moment(Timestamp.now().toDate()).format(),
                unReadMessagesCountFromAdmin:updatedCount
              });
    });
    setLoading(false)

  }
);
    }
    else if(etype=="video"){
      const storage = getStorage();
      const storageRef = ref(storage, `videos/${uuid()}`);
      const uploadTask = uploadBytesResumable(storageRef, e);
      uploadTask.on('state_changed', 
  (snapshot) => {
    setLoading(true)

    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
      console.log('File available at', downloadURL);
      await updateDoc(doc(db, `${admin.adminTypeName}`, data.chatId), {
                messages: arrayUnion({
                  adminId:currentUser.id,
                  message: downloadURL,
                  date: moment(Timestamp.now().toDate()).format(),
                  type:type.video
                }),
                lastMessage:"Video",
                lastMessageDate: moment(Timestamp.now().toDate()).format(),
                unReadMessagesCountFromAdmin:updatedCount
              });
    });
    setLoading(false)

  }
);
    } 
    else if(text){

    //  onSnapshot(doc(db,`${admin.adminTypeName}`, data.chatId), (doc) => {
    //   unReadMessagesCountFromAdmin=!doc.data().unReadMessagesCountFromAdmin?unReadMessagesCountFromAdmin:doc.data().unReadMessagesCountFromAdmin+1
    //     console.log('unReadMessagesCountFromAdmin', unReadMessagesCountFromAdmin);})
      await updateDoc(doc(db, `${admin.adminTypeName}`, data.chatId), {
        messages: arrayUnion({
          
          adminId:currentUser.id,
          message:text,
          date: moment(Timestamp.now().toDate()).format(),
          type:type.message
        }),
        lastMessage:text,
        lastMessageDate: moment(Timestamp.now().toDate()).format(),
        unReadMessagesCountFromAdmin:updatedCount

      });
    }
    else {
      // var i = e.name.lastIndexOf('.');
      // var extension =  e.name.substring(i+1);
      const storage = getStorage();
      const storageRef = ref(storage, `files/${uuid()}*${e.name.replace(/\s/g, "")}`);
      const uploadTask = uploadBytesResumable(storageRef, e);
      uploadTask.on('state_changed', 
  (snapshot) => {
    setLoading(true)

    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
      console.log("e.type.split('/')",e.type.split('/'))
      console.log("test")

      console.log('File available at', downloadURL);
      await updateDoc(doc(db, `${admin.adminTypeName}`, data.chatId), {
                messages: arrayUnion({
                  adminId:currentUser.id,
                  message: downloadURL,
                  date: moment(Timestamp.now().toDate()).format(),
                  type:type.file
                }),
                lastMessage:"File",
                lastMessageDate:moment(Timestamp.now().toDate()).format(),
                unReadMessagesCountFromAdmin:updatedCount
              });
    });
    setLoading(false)

  }
);
    }
  }
    setText("");
    setImg(null);

  };
  const listenToUserCount = (chatId, callback) => {
    const userDoc = doc(db,  `${admin.adminTypeName}`, chatId);
  
    const unsubscribe = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const count = doc.data().unReadMessagesCountFromAdmin;
  
        callback(count);
      }
    });
  
    return unsubscribe;
  };
  console.log("loading",loading)
  return (
    <>
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => {
            
            handleSend(e.target.files[0])
            
      
          
           
          }}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>
       {
        loading?
      <ClipLoader
      color={"red"}
      loading={loading}
      size={20}
      aria-label="Loading Spinner"
      data-testid="loader"
    />:"Send"}</button>
      </div>
    </div>
    </>

  );
};

export default Input;
