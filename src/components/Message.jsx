import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { ChatContext } from "../context/ChatContext";
import Admin from "../assets/img/admin.png";
import User from "../assets/img/user.png";
import { type } from "../config";
import File from "../assets/img/File.png";
import pdfIcon from "../assets/img/pdf.svg";
import mp3icon from "../assets/img/mp3.svg";
import txtIcon from "../assets/img/txt.svg";
import docxIcon from "../assets/img/docx.svg";
import xlsIcon from "../assets/img/xls.svg";
import dummyIcon from "../assets/img/dummy.svg";
import downloadIcon from "../assets/img/downloadIcon.svg";
const Message = ({ message, isLatest }) => {
  console.log("🚀 ~ file: Message.jsx:11 ~ Message ~ message:", message);
  const formatFileSize = (bytes) => {
    if (bytes >= 1073741824) {
      return (bytes / 1073741824).toFixed(2) + " GB";
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + " MB";
    } else {
      return (bytes / 1024).toFixed(2) + " KB";
    }
  };

  let srcIcon;

  switch (message.documentExtension) {
    case "mp3":
      srcIcon = mp3icon;
      break;
    case "pdf":
      srcIcon = pdfIcon;
      break;
    case "txt":
      srcIcon = txtIcon;
      break;
    case "docx":
      srcIcon = docxIcon;
      break;
    case "xls":
      srcIcon = xlsIcon;
      break;
    default:
      // Default icon or error handling when the extension doesn't match any of the cases
      srcIcon = dummyIcon;
      break;
  }
  const fileSize = formatFileSize(message.size);

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
    if (isLatest) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isLatest]);
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
          <>
            <div
              // href={message.message}
              // target='_blank'
              // download
              style={{
                position: "relative",
                display: "block",
                backgroundColor: "#8da4f1",
                padding: "3px",
                borderRadius: "5px",
                paddingBottom: "0",
              }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${!message.adminId ? "105%" : "-15%"}`,
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                }}
              >
                <a
                  target='_blank'
                  rel='noopener'
                  href={message.message}
                  download
                >
                  <img
                    src={downloadIcon}
                    alt=''
                    style={{ width: "24px", height: "24px" }}
                  />
                </a>
              </button>

              <img src={message.message} alt='' />
            </div>
            <span style={{ display: "block", lineHeight: "1", margin: "0" }}>
              {date}
            </span>
          </>
        ) : message.type == type.video ? (
          <video src={message.message} controls />
        ) : message.type == type.audio ? (
          <audio controls src={message.message}>
            {/* <a href='/media/cc0-audio/t-rex-roar.mp3'> Download audio </a> */}
          </audio>
        ) : message.type == type.file ? (
          <a
            href={message.message}
            className='anchor'
            style={{
              position: "relative",
              display: "block",
              padding: "3px",
              borderRadius: "5px",
              paddingBottom: "0",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "50%",
                left: `${message.adminId ? "-15%" : "102%"}`,
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
              }}
            >
              <a href={message.message} download>
                <img
                  src={downloadIcon}
                  alt=''
                  style={{ width: "24px", height: "24px" }}
                />
              </a>
            </button>
            <div
              style={{
                display: "flex",
                position: "relative",
                backgroundColor: `${message.adminId ? "#8da4f1" : "#eee"}`,
                alignItems: "flex-start",
                borderRadius: `${
                  message.adminId
                    ? " 1rem 0rem 1rem 1rem"
                    : " 0rem 1rem 1rem 1rem"
                }`,
                flexDirection: "row",
                minWidth: "20rem",
                padding: "1rem",
                paddingLeft: "0",
              }}
            >
              <img
                src={srcIcon}
                alt=''
                style={{ display: "block", width: "64px", height: "64px" }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  gap: ".3rem",
                }}
              >
                <p
                  style={{
                    padding: "0",
                    backgroundColor: "inherit",
                    border: "none",
                    lineHeight: "1",
                  }}
                >
                  {message.documentName}
                </p>
                <p
                  style={{
                    padding: "0",
                    backgroundColor: "inherit",
                    border: "none",
                    lineHeight: "1",
                  }}
                >
                  {message.size}
                </p>
              </div>
              <p
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  transform: "translate(-10%,-50%)",
                  marginLeft: "auto",
                  padding: "0",
                  backgroundColor: "inherit",
                  border: "none",
                  lineHeight: "1",
                  alignSelf: "flex-end",
                  fontSize: "1rem",
                }}
              >
                {date}
              </p>
            </div>
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
