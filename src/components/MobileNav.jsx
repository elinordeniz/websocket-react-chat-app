import { BiSolidChat } from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";


const MobileNav = ({toggleMobileUsers, username, handleLogout}) => {
  return (
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
  )
}

export default MobileNav