import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

import axios from "axios";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [isRegisterLogin, setIsRegisterLogin]=useState("login")

  const { setUsername: setCUsername, setId } = useContext(UserContext);

  const handleButton = (e, val)=>{
      e.preventDefault();
      setIsRegisterLogin(val);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url=isRegisterLogin==="login" ? "login" : "register"; 
    try {
      const response = await axios.post(`/auth/${url}`, {
        username,
        password
      });
      console.log(response);
      setCUsername(username);
      setId(response.data.id);

      setError("");
      setIsError(false);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || err?.message);
      setIsError(true);
      setPassword("");
      setUsername("");
    }
  };
  return (
    <div className=" bg-blue-50 h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl text-green-700 font-semibold tracking-wider">Chat App</h1>
      <p className={isError ? "text-red-600" : "hidden"}>{error}</p>
      <form
        onSubmit={handleSubmit}
        className="w-72 mx-auto flex flex-col space-y-4 py-12 "
      >
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className="w-full p-3 rounded-md "
          placeholder="Enter username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full p-3 rounded-md "
          placeholder="Enter password"

        />
        <button  className="w-full p-3 rounded-md bg-gradient-to-r from-green-600 to-blue-400 text-white ">
          {isRegisterLogin==="login" ? "Login" : isRegisterLogin==="register" && "Register"}
        </button>
       </form>
       <div className={isRegisterLogin==="login" ? "text-center" : "hidden"}>Don't have an account? <button onClick={(e)=>handleButton(e,"register")}  className="font-bold">Register Here</button></div>
        <div className={isRegisterLogin==="register" ? "text-center" : "hidden"}>Already a member? <button onClick={(e)=>handleButton(e,"login")} className="font-bold">Login Here</button></div>
      
    </div>
  );
};

export default Register;
