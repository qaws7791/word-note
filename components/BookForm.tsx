"use client";
import React, { useState,useEffect } from 'react'
import { createBook} from '@/net/db';
import { query,collection,where,onSnapshot,DocumentData } from 'firebase/firestore';
import db from '@/net/db';
import { useAuthContext } from '@/context/AuthContext';
import BookList from './BookList';
import List from '@mui/material/List'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function BookForm() {
  const {user} = useAuthContext();
  const router = useRouter();
  const [books, setBooks] = useState<DocumentData[]>();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const handleAddBook = async() => {
    try {
      if(!user) throw "no user data"
      if(!user.email) throw "no user email"
      const docRef = await createBook({
        authorName:user.email,
        bookName:"New book",
        userId:user.uid,
      })
      console.log("Document written with ID: ", docRef);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(() => {
    if(!user) { router.push('/'); return}
    const q = query(collection(db, "books"), where("userId", "==",user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const books:DocumentData[] = [];
      querySnapshot.forEach((book) => {
        const data = book.data()
        data.id= book.id;
        books.push(data);
      });
      setBooks(books)
      console.log("Current cities in CA: ", books.join(", "));
    });

    return unsubscribe
  },[user])


  return (
    <>
    <Box sx={{ width: '100%',position:'relative', bgcolor: 'background.paper', height:'100%'}}>
      <BookList books={books}/>
        <IconButton 
          size='large'
          aria-label="add" 
          onClick={handleAddBook}  
          sx={{ 
          "&:hover": { backgroundColor: "#2c5da7" }, 
          backgroundColor:'#3774cd',
          position: 'absolute',
          right: '8%',
          bottom: '10%',
          }}
        >
          <AddIcon sx={{color: '#fff'}} fontSize="inherit"/>
        </IconButton>
    </Box>
    </>

  )
}