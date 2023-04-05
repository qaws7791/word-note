"use client"
import React, { useEffect } from 'react'
import BookForm from '@/components/BookForm';
import { useAuthContext } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useTitleContext } from '@/context/TitleContext';
export default function UserPage({
  params
}:{
  params: {userId:string};
}) {
  const {user}= useAuthContext();
  const {setTitle} = useTitleContext();

  useEffect(() => {
    setTitle('My Book List')
  },[])

  if(!user) {redirect('/')}

  //다른 사람 페이지 방문 시
  if(params.userId !== user.uid) {
    redirect(`/${user.uid}`)
  }
  


  return (
      <BookForm/>
  )
}
