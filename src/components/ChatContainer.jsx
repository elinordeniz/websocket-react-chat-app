import { RiAttachment2 } from "react-icons/ri";
import axios from "axios";

const ChatContainer = ({ lastMessage, uniqueMessages, id }) => {
  return (
    <div className="flex flex-col overflow-scroll h-full w-full">
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
                href={axios.defaults.baseURL + "/uploads/" + message.file}
              >
                <RiAttachment2 /> {message.file}
              </a>
            </div>
          )}
        </div>
      ))}
      <div ref={lastMessage}></div>
    </div>
  );
};

export default ChatContainer;
