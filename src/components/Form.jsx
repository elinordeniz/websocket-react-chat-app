import { BiSend } from "react-icons/bi";
import { RiAttachment2 } from "react-icons/ri";

const Form = ({onChange, sendMessage, newMessage, handleSendFile}) => {
  return (
    <form
              onSubmit={sendMessage}
              className="flex w-full flex-wrap sm:flex-none justify-center gap-2 p-4 fle sm:p-5 sm:mt-4 md:mt-0 left-0 bottom-0 sticky md:p-0 bg-green-50 "
            >
              <input
                type="text"
                placeholder="Type your message here"
                value={newMessage}
                onChange={onChange}
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
  )
}

export default Form