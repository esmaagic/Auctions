'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { fetchUser } from '@/services/fetchUser';
import withAuth from '@/hoc/withAuth';
import UserMessages from '@/components/UserMessages';
import SendMessages from '@/components/SendMessages';
import CustomSkeleton from '@/components/CustomSkeleton';

const MessagesPage = () => {
  const [user, setUser] = useState(null);
  
  const [userError, setUserError] = useState('');
  useEffect(() => {
    fetchUser(setUser,setUserError)
  }, []);
  
  if(!user) return <CustomSkeleton />
  return (
    <>
      {user.username === "admin" ? <SendMessages user={user} /> : <UserMessages  user={user} /> }
    </>
    
  )
}

export default withAuth(MessagesPage)