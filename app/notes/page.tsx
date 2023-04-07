"use client"
import React, { useEffect } from 'react'
import BookForm from '@/components/BookForm';
import { useAuthContext } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useTitleContext } from '@/context/TitleContext';
export default function UserPage() {
  const {user}= useAuthContext();
  const {setTitle} = useTitleContext();

  useEffect(() => {
    setTitle('My Book List')
  },[])

  if(!user) {redirect('/')}

  return (
      <BookForm/>
  )
}
