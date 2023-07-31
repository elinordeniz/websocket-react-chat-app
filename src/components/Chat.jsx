import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { MessageContext } from "../context/MessageContext";
import axios from "axios";
import Form from "./Form";
import ChatContainer from "./ChatContainer";
import MobileNav from "./MobileNav";
import UserNav from "./UserNav";
import MobileUserNav from "./MobileUserNav";
import Loading from "./Loading";

const Chat = () => {
  const [isMobileToggle, setIsMobileToggle] = useState(false);
  const { username, id, setId, setUsername, onlineUsers, getOfflineUsers } =
    useContext(UserContext);
  const {
    connetToWs,
    ws,
    selectedConvo,
    setSelectedConvo,
    messages,
    isLoading,
    uniqueMessages,
  } = useContext(MessageContext);
  const lastMessage = useRef(null);

  const toggleMobileUsers = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileToggle((prev) => !prev);
  };

  useEffect(() => {
    connetToWs();
  }, []);

  const selectConvo = (userId) => {
    setSelectedConvo(userId);
    if (isMobileToggle) {
      setIsMobileToggle(false);
    }
  };

  const handleLogout = () => {
    axios.get("/auth/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
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
    getOfflineUsers(ws);
  }, [onlineUsers]);

  return (
    <div className="flex sm:flex-col md:flex-row h-screen w-full overflow-hidden">
      <MobileNav
        toggleMobileUsers={toggleMobileUsers}
        username={username}
        handleLogout={handleLogout}
      />
      <MobileUserNav
        isMobileToggle={isMobileToggle}
        selectConvo={selectConvo}
        selectedConvo={selectedConvo}
      />
      <UserNav selectConvo={selectConvo} handleLogout={handleLogout} />

      <div className="flex flex-1 flex-col  bg-green-50 sm:w-full p-1 sm:flex-1 md:w-2/3 md:p-6 ">
        <Loading isLoading={isLoading} selectedConvo={selectedConvo} />

        {!!selectedConvo && !isLoading && (
          <ChatContainer
            lastMessage={lastMessage}
            uniqueMessages={uniqueMessages}
            id={id}
          />
        )}
        {!!selectedConvo && <Form />}
      </div>
    </div>
  );
};

export default Chat;
