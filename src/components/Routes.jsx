import RegisterLogin from "./RegisterLogin"
import { useContext } from "react";
import {UserContext} from '../context/UserContext'
import Chat from "./Chat";


 const Routes = () => {
    const {username}= useContext(UserContext);
    console.log(username)

    if(username){
        return <Chat />
    }
   return (
     <RegisterLogin />
   )
 }
 
 export default Routes