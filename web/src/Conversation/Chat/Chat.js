import React, { useEffect, useRef, useState } from "react";
import { MessageList } from "react-chat-elements";
import socket from "../../Socket/Socket";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { ScrollPanel } from "primereact/scrollpanel";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ChatLoader } from "./ChatLoader";
import "./chat.css";
import { Grow, Tooltip, Typography } from "@mui/material";
import chatbot from "../../assets/Chat bot-pana.png";
import { Image } from "primereact/image";
import { Menubar } from 'primereact/menubar';
import { SummaryExport } from "../Summary/Export/SummaryExport";
import { SummaryView } from "../Summary/SummaryView";
        
export function Chat({ summary = "", filename = "" }) {
  const [userInput, setUserInput] = useState("");
  const chatListRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const[visible,setVisible] =  useState(false);

  useEffect(() => {
    const listeners = socket.listeners("ConversationResponse");
    listeners.forEach((listener) => {
      socket.off("ConversationResponse", listener);
    });
    socket.on("ConversationResponse", (res) => {
      console.log(res?.data);
      setChats((prev) => [
        ...prev,
        {
          position: "left",
          type: "text",
          title: "Assistant",
          text: res?.data,
        },
      ]);
      setShowLoader(false);
    });
    return () => {
      socket.off("ConversationResponse", () => console.log("UnMounted"));
    };
  }, []);

  function start_conversation() {
    chatListRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowLoader(true);
    setChats([
      ...chats,
      {
        position: "right",
        type: "text",
        title: "User",
        text: userInput,
      },
    ]);
    socket.emit("ConversationInput", { data: userInput, filename });
    setUserInput("");
  }

  useEffect(() => {
    chatListRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <>
      <Splitter style={{ height: "100vh" }}>
        <SplitterPanel className="flex align-items-center justify-content-center">
          <ScrollPanel
            style={{ width: "100%", height: "100vh" }}
            className="custombar1"
          >         
           <SummaryView setVisible={setVisible} filename={filename} summary={summary} />
          </ScrollPanel>
        </SplitterPanel>
        <SplitterPanel className="flex" style={{ marginBottom: 100 }}>
          {chats?.length > 0 ? (
            <ScrollPanel
              style={{
                width: "100%",
                height: "100%",
                marginBottom: 20,
                padding: 35,
              }}
              className="custombar2"
            >
              <div style={{ marginTop: 25 }}>
                <MessageList
                  className="message-list"
                  lockable={true}
                  toBottomHeight={"100%"}
                  dataSource={chats}
                />
              </div>
              <div style={{ height: "100px", padding: 20 }}>
                {showLoader && <ChatLoader />}
              </div>
              <div ref={chatListRef} />
            </ScrollPanel>
          ) : (
            <Image
              src={chatbot}
              alt="Image"
              width="100%"
              height="500vh"
              style={{ margin: "auto" }}
            />
          )}
          <div
            className="p-inputgroup"
            style={{
              position: "fixed",
              bottom: 0,
              width: "50%",
              padding: 15,
              zIndex: 1,
            }}
          >
            <InputText
              placeholder="Send a message"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  start_conversation();
                }
              }}
              disabled={showLoader}
            />
            <Button
              icon="pi pi-send"
              onClick={() => start_conversation()}
              disabled={!userInput || showLoader}
              style={{backgroundColor:"#86bc25"}}
            />
          </div>
        </SplitterPanel>
      </Splitter>
      <SummaryExport visible={visible} setVisible={setVisible} summary={summary} filename={filename} />
    </>
  );
}
