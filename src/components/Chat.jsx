import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import User from "./User";
import { FaUser } from "react-icons/fa";
import { BiSend, BiSolidChat } from "react-icons/bi";
import { RiAttachment2, RiLogoutCircleRLine } from "react-icons/ri";

// import {useNavigate} from 'react-router-dom'

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [isMobileToggle, setIsMobileToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [offlineUsers, setOfflineUsers] = useState({});
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { username, id, setId, setUsername } = useContext(UserContext);
  const lastMessage = useRef(null);

  const toggleMobileUsers = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileToggle((prev) => !prev);
  };

  useEffect(() => {
    connetToWs();
  }, []);

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
  const showOnlineUsers = (usersArray) => {
    const uniqueUsers = {};
    usersArray.forEach((u) => {
      uniqueUsers[u.userId] = [];
      uniqueUsers[u.userId].username = u.username;
      uniqueUsers[u.userId].online = true;
    });
    setOnlineUsers({ ...uniqueUsers });
  };
  const onlineUsersExUs = { ...onlineUsers };
  delete onlineUsersExUs[id]; //deleting our user info

  const handleMessage = (event) => {
    const messageData = JSON.parse(event.data);
    if ("online" in messageData) {
      showOnlineUsers(messageData.online);
    } else if ("text" in messageData) {
      if (selectedConvo === messageData.sender) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  };

  const selectConvo = (userId) => {
    setSelectedConvo(userId);
    if (isMobileToggle) {
      setIsMobileToggle(false);
    }
  };

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
  const handleLogout = () => {
    axios.get("/auth/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
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
  };
  useEffect(() => {
    const scroll = lastMessage.current;
    if (scroll) {
      scroll.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

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
  const uniqueMessages = uniqBy(messages, "_id");

  useEffect(() => {
    ws &&
      axios.get("/users").then((res) => {
        const offlineUsersArr = res.data
          .filter((p) => p._id !== id)
          .filter((p) => !Object.keys(onlineUsers).includes(p._id));
        const offlineUsersObj = {};
        offlineUsersArr.forEach((u) => {
          offlineUsersObj[u._id] = [];
          offlineUsersObj[u._id].username = u.username;
          offlineUsersObj[u._id].online = false;
        });
        setOfflineUsers({ ...offlineUsersObj });
      });
  }, [onlineUsers]);

  const allUsers = Object.assign(onlineUsersExUs, offlineUsers);

  return (
    <div className="flex sm:flex-col md:flex-row h-screen sm:relative md:none overscroll-none ">
      <div className=" top-0 left-0 h-[60px] flex md:hidden">
        <div className="flex w-full text-center p-5 font-light tracking-wider text-xl text-gray-600 border-b shadow-xl shadow-white space-x-7 justify-center items-center ">
          <span className="text-sm flex gap-x-12 justify-between items-center">
            <button
              className="flex items-center gap-1"
              onClick={toggleMobileUsers}
            >
              <BiSolidChat /> Users
            </button>
            <span className="flex items-center gap-1">
              <FaUser /> {username}
            </span>

            <button className="flex items-center gap-1" onClick={handleLogout}>
              <RiLogoutCircleRLine /> Log Out
            </button>
          </span>
        </div>
      </div>
      <span className=" sm:flex sm:flex-col sm:flex-1 md:flex-row overflow-y-auto">
      <div
          className={
            isMobileToggle
              ? "flex flex-col sticky left-0 -top-2 w-full min-h-3/5 bg-white  z-10"
              : "hidden"
          }
        >
          {Object.keys(allUsers).map((userId) => (
            <User
              key={userId}
              onClick={() => selectConvo(userId)}
              selectConvo={selectConvo}
              initial={allUsers[userId]?.username?.slice(0, 1)}
              selected={selectedConvo === userId}
              online={allUsers[userId]?.online}
              userName={allUsers[userId].username}
            />
          ))}
        </div>
        {selectedConvo && !isMobileToggle && (
          <div className="flex w-full h-16 bg-white sticky left-0 top-0 px-5 md:hidden">
            <User
              initial={allUsers[selectedConvo]?.username?.slice(0, 1)}
              online={allUsers[selectedConvo]?.online}
              userName={allUsers[selectedConvo].username}
            />
          </div>
        )}

       
        <div className="sm:hidden w-full md:flex md:flex-col md:bg-stone-50-50 md:w-1/3 md:pt-4 md:justify-between">
          <div className="md:overflow-auto">
            <div className="text-lime-800 font-bold text-2xl py-2 pl-3 text-center">
              Chat APP
            </div>

            {Object.keys(allUsers).map((userId) => (
              <User
                key={userId}
                onClick={() => selectConvo(userId)}
                selectConvo={selectConvo}
                initial={allUsers[userId]?.username?.slice(0, 1)}
                selected={selectedConvo === userId}
                online={allUsers[userId]?.online}
                userName={allUsers[userId].username}
              />
            ))}
          </div>
          <div className="flex text-center p-5 font-light tracking-wider text-xl text-gray-600 border-t shadow-xl shadow-black space-x-7 justify-center items-center ">
            <span className="text-sm flex gap-x-2 justify-center items-center">
              <FaUser /> {username}
            </span>{" "}
            <button
              className="text-sm border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-500 hover:text-white"
              onClick={handleLogout}
            >
              {" "}
              Log Out
            </button>
          </div>
        </div>
        <div className="flex flex-col bg-green-50 sm:w-full p-1 sm:flex-1 md:w-2/3 md:p-6 ">
          <div className="flex-1">
            <div className="flex flex-grow h-full  items-center justify-center font-extralight text-2xl">
              {!selectedConvo && "No convo selected to type!"}
              {isLoading && (
                <span className="animate-spin h-3 w-3 mr-5 ">{".."}</span>
              )}
            </div>
          </div>

          {!!selectedConvo && !isLoading && (
            <div className="flex flex-col overflow-y-scroll w-full">
              {uniqueMessages.map((message, key) => (
                <div
                  key={key}
                  className={`flex flex-row break-all p-3 my-2 w-3/5 max-w-full rounded-md bg-[#FDFDFD] text-gray-500  ${
                    message.sender === id ? "self-end" : "self-start"
                  } `}
                >
                  {message.text}
                  {message.file && (
                    <div>
                      <a
                        target="_blank"
                        className="underline flex items-center gap-1"
                        href={
                          axios.defaults.baseURL + "/uploads/" + message.file
                        }
                      >
                        <RiAttachment2 /> {message.file}
                      </a>
                    </div>
                  )}
                </div>
              ))}
              <div ref={lastMessage}></div>
            </div>
          )}

          {!!selectedConvo && (
            <form
              onSubmit={sendMessage}
              className="flex w-full flex-wrap sm:flex-none justify-center gap-2 p-4 fle sm:p-5 sm:mt-4 md:mt-0 left-0 bottom-0 sticky md:p-0 bg-green-50 "
            >
              <input
                type="text"
                placeholder="Type your message here"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-white border p-3 px-3 flex-grow rounded-md border-lime-200 focus:border-lime-900"
              />
              <label
                type="button"
                className="bg-gray-400 p-3 text-white rounded-md text-2xl"
              >
                <input
                  type="file"
                  className="hidden"
                  onChange={handleSendFile}
                />
                <RiAttachment2 />
              </label>
              <button
                type="submit"
                className="bg-green-600 p-3 text-white rounded-md text-2xl"
              >
                <BiSend />
              </button>
            </form>
          )}
        </div>
      </span>
    </div>
  );
};

export default Chat;
