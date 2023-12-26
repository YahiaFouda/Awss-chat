import React, { useContext, useEffect, useRef, useState } from "react";
import Img from "../assets/img/img.png";
import Attach from "../assets/img/attach.png";
import { type } from "../config";
import moment from "moment";

import { Alert, Space, Spin } from "antd";
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
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const { data, setData } = useContext(ChatContext); // Assuming you have a setData function in your context

  const fileInputRef = useRef(null);
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the default behavior of the Enter key (e.g., line break in textarea)

      await handleSendTextMessage();
    }
  };
  const handleSendTextMessage = async () => {
    if (text.trim() !== "") {
      // Check if the text input is not empty
      setCount((prev) => prev + 1);
      let updatedCount = count + 1;

      await updateDoc(doc(db, `${admin.adminTypeName}`, data.chatId), {
        messages: arrayUnion({
          adminId: currentUser.id,
          message: text,
          size: null,
          documentName: null,
          documentExtension: null,
          date: moment(Timestamp.now().toDate()).format(),
          type: type.message,
        }),
        lastMessage: text,
        lastMessageDate: moment(Timestamp.now().toDate()).format(),
        unReadMessagesCountFromAdmin: updatedCount,
        unReadMessagesCountFromUser: 0,
      });

      setText(""); // Clear the text input after sending the message
    }
  };
  const resetUnreadMessages = async () => {
    if (data.chatId) {
      await updateDoc(doc(db, `${admin.adminTypeName}`, data.chatId), {
        unReadMessagesCountFromUser: 0,
      });
      setData((prevData) => ({ ...prevData, unReadMessagesCountFromUser: 0 }));
    }
  };
  const handleInputFocus = () => {
    resetUnreadMessages();
  };
  // Function to clear the file input field
  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  useEffect(() => {
    const unsubscribe = listenToUserCount(data.chatId, (newCount) => {
      setCount(newCount);
    });
    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, []);

  const { authorization: currentUser } = useSelector(
    (state) => state.authorization,
  );
  let admin = JSON.parse(localStorage.getItem("authorization"));

  const formatFileSize = (bytes) => {
    console.log("🚀 ~ file: Input.jsx:73 ~ formatFileSize ~ bytes:", bytes);

    if (!bytes) return null;
    if (bytes >= 1073741824) {
      return (bytes / 1073741824).toFixed(2) + " GB";
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + " MB";
    } else {
      return (bytes / 1024).toFixed(2) + " KB";
    }
  };
  const handleSend = async (e) => {
    const fileSize = formatFileSize(e?.size);
    setCount((prev) => prev + 1);
    let updatedCount = count + 1;
    console.log("updatedCount", updatedCount);
    console.log("data.chatId", data.chatId);
    let size = e.size / 1000000;
    if (size > 16) {
      alert("sorry,maximum size is 16mb");
    } else {
      let etype = e.type.split("/")[0];
      if (etype == "image") {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${uuid()}`);
        const uploadTask = uploadBytesResumable(storageRef, e);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            setLoading(true);
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            setLoading(false);
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(
                  doc(db, `${admin.adminTypeName}`, data.chatId),
                  {
                    messages: arrayUnion({
                      adminId: currentUser.id,
                      message: downloadURL,
                      size: fileSize,
                      documentName: e.name,
                      documentExtension: e.name.split(".").pop(),
                      date: moment(Timestamp.now().toDate()).format(),
                      type: type.image,
                    }),
                    lastMessage: "Image",
                    lastMessageDate: moment(Timestamp.now().toDate()).format(),
                    unReadMessagesCountFromAdmin: updatedCount,
                    unReadMessagesCountFromUser: 0,
                  },
                );
              },
            );
            setLoading(false);
          },
        );
      } else if (etype == "video") {
        const storage = getStorage();
        const storageRef = ref(storage, `videos/${uuid()}`);
        const uploadTask = uploadBytesResumable(storageRef, e);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setLoading(true);

            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                await updateDoc(
                  doc(db, `${admin.adminTypeName}`, data.chatId),
                  {
                    messages: arrayUnion({
                      adminId: currentUser.id,
                      message: downloadURL,
                      size: fileSize,
                      documentName: e.name,
                      documentExtension: e.name.split(".").pop(),
                      date: moment(Timestamp.now().toDate()).format(),
                      type: type.video,
                    }),
                    lastMessage: "Video",
                    lastMessageDate: moment(Timestamp.now().toDate()).format(),
                    unReadMessagesCountFromAdmin: updatedCount,
                    unReadMessagesCountFromUser: 0,
                  },
                );
              },
            );
            setLoading(false);
          },
        );
      } else if (text) {
        //  onSnapshot(doc(db,`${admin.adminTypeName}`, data.chatId), (doc) => {
        //   unReadMessagesCountFromAdmin=!doc.data().unReadMessagesCountFromAdmin?unReadMessagesCountFromAdmin:doc.data().unReadMessagesCountFromAdmin+1
        //     console.log('unReadMessagesCountFromAdmin', unReadMessagesCountFromAdmin);})
        await updateDoc(doc(db, `${admin.adminTypeName}`, data.chatId), {
          messages: arrayUnion({
            adminId: currentUser.id,
            message: text,
            size: null,
            documentName: null,
            documentExtension: null,
            date: moment(Timestamp.now().toDate()).format(),
            type: type.message,
          }),
          lastMessage: text,
          lastMessageDate: moment(Timestamp.now().toDate()).format(),
          unReadMessagesCountFromAdmin: updatedCount,
          unReadMessagesCountFromUser: 0,
        });
      } else {
        // var i = e.name.lastIndexOf('.');
        // var extension =  e.name.substring(i+1);
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `files/${uuid()}*${e.name.replace(/\s/g, "")}`,
        );
        const uploadTask = uploadBytesResumable(storageRef, e);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setLoading(true);

            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            if (e?.name) {
              const documentExtension = e.name.split(".").pop();
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  console.log("e.type.split('/')", e.type.split("/"));
                  console.log("test");

                  console.log("File available at", downloadURL);
                  await updateDoc(
                    doc(db, `${admin.adminTypeName}`, data.chatId),
                    {
                      messages: arrayUnion({
                        adminId: currentUser.id,
                        message: downloadURL,
                        size: fileSize || null,
                        documentName: e?.name || null,
                        documentExtension: documentExtension,
                        date: moment(Timestamp.now().toDate()).format(),
                        type: type.file,
                      }),
                      lastMessage: "File",
                      lastMessageDate: moment(
                        Timestamp.now().toDate(),
                      ).format(),
                      unReadMessagesCountFromAdmin: updatedCount,
                      unReadMessagesCountFromUser: 0,
                    },
                  );
                },
              );
            } else {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  console.log("e.type.split('/')", e.type.split("/"));
                  console.log("test");

                  console.log("File available at", downloadURL);
                  await updateDoc(
                    doc(db, `${admin.adminTypeName}`, data.chatId),
                    {
                      messages: arrayUnion({
                        adminId: currentUser.id,
                        message: downloadURL,
                        size: null,
                        documentName: null,
                        documentExtension: null,
                        date: moment(Timestamp.now().toDate()).format(),
                        type: type.file,
                      }),
                      lastMessage: "File",
                      lastMessageDate: moment(
                        Timestamp.now().toDate(),
                      ).format(),
                      unReadMessagesCountFromAdmin: updatedCount,
                      unReadMessagesCountFromUser: 0,
                    },
                  );
                },
              );
            }
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...

            setLoading(false);
          },
        );
      }
    }
    clearFileInput();
    setText("");
    setImg(null);
  };
  const listenToUserCount = (chatId, callback) => {
    const userDoc = doc(db, `${admin.adminTypeName}`, chatId);

    const unsubscribe = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const count = doc.data().unReadMessagesCountFromAdmin;

        callback(count);
      }
    });

    return unsubscribe;
  };
  console.log("loading", loading);
  return (
    <>
      <div className='input'>
        <input
          type='text'
          placeholder='Type something...'
          onChange={(e) => setText(e.target.value)}
          value={text}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
        />
        <div className='send'>
          <input
            type='file'
            style={{ display: "none" }}
            id='file'
            ref={fileInputRef}
            onChange={(e) => {
              handleSend(e.target.files[0]);
            }}
          />
          <label htmlFor='file'>
            <img src={Img} alt='' />
          </label>
          <button onClick={handleSend}>
            {loading ? (
              <ClipLoader
                color={"red"}
                loading={loading}
                size={20}
                aria-label='Loading Spinner'
                data-testid='loader'
              />
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Input;
