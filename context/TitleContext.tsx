'use client';

import { createContext,useContext, Dispatch, SetStateAction, useState, useEffect } from "react";

interface ContextProps {
  title: string,
  setTitle: Dispatch<SetStateAction<string>>
}

const TitleContext = createContext<ContextProps>({
  title: '',
  setTitle: () => '',
});

export const TitleContextProvider = ({ children }) => {
  const [title, setTitle] = useState<string>('');
  
  useEffect(() => {
    console.log('title changed: ', title)
  },[title])

  const value = {
    title,
    setTitle,
  }

  return (
    <TitleContext.Provider value={value}>
      {children}
    </TitleContext.Provider>
  )
}

export const useTitleContext = () => useContext(TitleContext);