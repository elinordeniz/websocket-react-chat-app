import MobileUsers from "./MobileUsers";
import User from "./User";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";



const MobileUserNav = ({isMobileToggle, selectConvo, selectedConvo}) => {
    const {allUsers}=useContext(UserContext);
  
    return (
    <>
       <MobileUsers isMobileToggle={isMobileToggle} selectConvo={selectConvo}/>
        {selectedConvo && !isMobileToggle && (
          <div className="flex w-full h-16 bg-white sticky left-0 top-0 px-5 md:hidden">
            <User
              initial={allUsers[selectedConvo]?.username?.slice(0, 1)}
              online={allUsers[selectedConvo]?.online}
              userName={allUsers[selectedConvo].username}
            />
          </div>
        )}
    </>
  )
}

export default MobileUserNav