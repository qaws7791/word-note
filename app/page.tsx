"use client";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import LoginForm from "@/components/LoginForm";
import { useAuthContext } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useTitleContext } from "@/context/TitleContext";
import { useEffect } from "react";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {user}= useAuthContext();
  const {title,setTitle} = useTitleContext();


  useEffect(() => {
    setTitle('Home')
    console.log(title)
  })
  if(user) redirect(`/${user.uid}`)

  return (
      <LoginForm/>
  );
}
