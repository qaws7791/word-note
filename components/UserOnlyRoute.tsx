import React from 'react'
import { useAuthContext } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { NextPage } from 'next';

export default function UserOnlyRoute(Component: NextPage | React.FC) {
  const {user}= useAuthContext();

  if(!user) {redirect('/')}

  return <Component/>
}
