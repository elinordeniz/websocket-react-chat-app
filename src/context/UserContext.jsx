import {createContext, useEffect, useState} from "react";
import axios from "axios";

export const UserContext= createContext({});

export function UserContextProvider({children}){
    const [username, setUsername]=useState(null);
    const [id, setId]=useState(null)


    useEffect( ()=>{
       const getProfile = async ()=>{
       await axios.get('/auth/profile').then((res)=>{
            console.log( "profile")
           setId(res.data.userId);
           setUsername(res.data.username)
       })
       }

       getProfile();
    },[])


    const data={username, setUsername, id, setId}


    return (
        <UserContext.Provider value={data}>
{children}
        </UserContext.Provider>
    )
}