import { useContext } from "react";
import User from "./User";
import { UserContext } from "../context/UserContext";
import { MessageContext } from "../context/MessageContext";
import { FaUser } from "react-icons/fa";


const UserNav = ({selectConvo, handleLogout}) => {
    const {allUsers, username}=useContext(UserContext);
    const {selectedConvo}= useContext(MessageContext);
  return (
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
  )
}

export default UserNav