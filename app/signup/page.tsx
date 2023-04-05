"use client"
import React, { useEffect } from 'react'
import SignupForm from '@/components/SignupForm'
import { useAuthContext } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useTitleContext } from '@/context/TitleContext';

export default function SignupPage() {
  const {user}= useAuthContext();
  const {setTitle} = useTitleContext();

  useEffect(()=> {
    setTitle('Sign up')
  })

  if(user) {redirect('/')}

  return (
    <SignupForm/>
  )
}
