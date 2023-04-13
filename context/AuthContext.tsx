'use client';

import { createContext,useContext, Dispatch, SetStateAction, useState, useEffect } from "react";
import { User } from "firebase/auth";
import auth from "@/net/auth";

interface ContextProps {
  user: User | null,
  setUser: Dispatch<SetStateAction<User | null>>
}

const AuthContext = createContext<ContextProps>({
  user: null,
  setUser: () => {},
});

export const AuthContextProvider = ({ children }:{children:any}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
      console.log("onAuthStateChanged",user)
      setLoading(false)
    })

    return unsubscribe
  })

  const value = {
    user, 
    setUser, 
    isLoading, 
    setLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext);