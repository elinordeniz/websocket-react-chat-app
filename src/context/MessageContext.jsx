import { useEffect, useState, createContext, useContext } from "react";
import { uniqBy } from "lodash";
import axios from "axios";
import { UserContext } from "./UserContext";
export const MessageContext = createContext({});

export function MessageContextProvider({ children }) {
  const [ws, setWs] = useState(null);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { showOnlineUsers, id } = useContext(UserContext);

  useEffect(() => {
    if (selectedConvo) {
      setIsLoading(true);
      axios
        .get(`/messages/${selectedConvo}`)
        .then((res) => {
          setMessages(res.data.messages);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedConvo]);

  const connetToWs = () => {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected, trying to reconnect");
        connetToWs();
      }, [1000]);
    });
  };

  function handleMessage (event) {
    const messageData = JSON.parse(event?.data);
    if ("online" in messageData) {
      showOnlineUsers(messageData?.online);
    } else if ("text" in messageData) {
      if (selectedConvo === messageData.sender) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    } else return;
  };



  const sendMessage = (e, file = null) => {
    if (e) e.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedConvo,
        text: newMessage,
        sender: id,
        file,
      })
    );
    if (file) {
      setIsLoading(true);
      axios
        .get(`/messages/${selectedConvo}`)
        .then((res) => {
          setMessages(res.data.messages);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setNewMessage("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessage,
          sender: id,
          recipient: selectedConvo,
          _id: Date.now(),
        },
      ]);
      console.log({
        text: newMessage,
        sender: id,
        recipient: selectedConvo,
        _id: Date.now(),
      });
    }
  }

  const handleSendFile = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
  };

  const uniqueMessages = uniqBy(messages, "_id");

  const data = {
    connetToWs,
    ws,
    selectedConvo,
    setSelectedConvo,
    messages,
    setMessages,
    setNewMessage,
    newMessage,
    sendMessage,
    isLoading,
    setIsLoading,
    uniqueMessages,
    handleSendFile
  };
  return (
    <MessageContext.Provider value={data}>{children}</MessageContext.Provider>
  );
}
