"use client";
import { useState,FormEvent, ReactElement } from "react";
import styles from "@/styles/LoginForm.module.css";
import Input from "./Input";
import Button from "./Button";
import { signIn } from "@/net/auth";

export default function LoginForm(): ReactElement {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const user = await signIn({ email, password });
      console.log('Login Success', user);
    } catch (e: any) {
      console.log('Login Error', e.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h1 className={styles.title}>로그인</h1>
      <div>
        <Input
          type="text"
          className={styles.input}
          value={email}
          autoComplete="username"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter email"
        />
      </div>
      <div>
        <Input
          type="password"
          className={styles.input}
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button type="submit" className={styles.button}>
          로그인
        </Button>
      </div>
    </form>
  );
}