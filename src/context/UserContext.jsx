import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [offlineUsers, setOfflineUsers] = useState({});
  

  useEffect(() => {
    const getProfile = async () => {
      await axios.get("/auth/profile").then((res) => {
        setId(res.data.userId);
        setUsername(res.data.username);
      });
    };

    getProfile();
  }, []);

  function showOnlineUsers(usersArray) {
    const uniqueUsers = {};
    usersArray.forEach((u) => {
      uniqueUsers[u.userId] = [];
      uniqueUsers[u.userId].username = u.username;
      uniqueUsers[u.userId].online = true;
    });
    setOnlineUsers({ ...uniqueUsers });
    return null
  };


  function getOfflineUsers(ws) {
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
  }

  const onlineUsersExUs = { ...onlineUsers };
  delete onlineUsersExUs[id]; //deleting our user info
  const allUsers = Object.assign(onlineUsersExUs, offlineUsers);

  const data = {
    username,
    setUsername,
    id,
    setId,
    onlineUsers,
    showOnlineUsers,
    getOfflineUsers,
    allUsers,
  };

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}
