"use client"
import LoginForm from '@/components/LoginForm'
import React, {useEffect} from 'react'
import { useAuthContext } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useTitleContext } from '@/context/TitleContext';



export default function LoginPage() {
  const {user}= useAuthContext();
  const {setTitle} = useTitleContext();

  useEffect(()=> {
    setTitle('Sign in')
  })

  if(user) {redirect('/')}

  return (
  <LoginForm/>
  )
}
