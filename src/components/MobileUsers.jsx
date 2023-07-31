import { useContext } from "react";
import User from "./User";
import { UserContext } from "../context/UserContext";
import { MessageContext } from "../context/MessageContext";


const MobileUsers = ({isMobileToggle, selectConvo}) => {
    const {allUsers}=useContext(UserContext);
    const {selectedConvo}= useContext(MessageContext);
  return (
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
              initial={allUsers[userId]?.username?.slice(0, 1)}
              selected={selectedConvo === userId}
              online={allUsers[userId]?.online}
              userName={allUsers[userId].username}
            />
          ))}
        </div>
  )
}

export default MobileUsers