"use client";
import { FormEvent, ReactElement, useState } from "react";
import { signUp } from "@/net/auth";
import Button from "./Button";

export default function Signup():ReactElement {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    try {
      const user = await signUp({ email, password });
      console.log("Signup Success", user.email);
    } catch (e: any) {
      console.log("Signup Error", e.message);
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          type="email"
          placeholder="enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div>
        <Button type="submit">Sign Up</Button>
      </div>
    </form>
  );
}
