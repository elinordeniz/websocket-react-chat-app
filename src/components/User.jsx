import { initial } from "lodash";
import Avatar from "./Avatar";

const User = ({  selected, userName, initial, onClick, online }) => {
  
  return (
    <div
    onClick={onClick}
      className={
        " py-3 flex gap-2 items-center pl-4 pt-4 text-gray-500 " + ( onClick ? "border-b border-gray-100" : "")+
        (selected
          ? "bg-green-50 border-l-8 border-green-700"
          : "")
      }
    >
      <Avatar initial={initial} online={online} />
      {userName}
    </div>
  );
};

export default User;
