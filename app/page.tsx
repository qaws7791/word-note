"use client";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import LoginForm from "@/components/LoginForm";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import auth from "@/net/auth";
import Button from "@/components/Button";
import { logout } from "@/net/auth";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        setUserInfo(user);
      } else {
        // User is signed out
        // ...
      }
    });
  });

  const handleSignOutButton = async () => {
    try {
      await logout();
      setUserInfo(null);
      console.log("Logout Success");
    } catch (e) {
      console.log("Logout error: ", e.message);
    }
  };

  return (
    <main className={styles.main}>
      {!userInfo ? (
        <LoginForm />
      ) : (
        <div>
          {userInfo.email}
          <Button onClick={handleSignOutButton}>Logout</Button>
        </div>
      )}
    </main>
  );
}
