import { BiSend } from "react-icons/bi";
import { RiAttachment2 } from "react-icons/ri";
import { MessageContext } from "../context/MessageContext";
import { useContext } from "react";

const Form = () => {
  const { sendMessage, newMessage, handleSendFile, setNewMessage } =
    useContext(MessageContext);
  return (
    <form
      onSubmit={sendMessage}
      className="flex w-full justify-center gap-2 p-4 max-h-[120px] "
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
        <input type="file" className="hidden" onChange={handleSendFile} />
        <RiAttachment2 />
      </label>
      <button
        type="submit"
        className="bg-green-600 p-3 text-white rounded-md text-2xl"
      >
        <BiSend />
      </button>
    </form>
  );
};

export default Form;
