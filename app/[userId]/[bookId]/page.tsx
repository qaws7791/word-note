'use client'
import React from 'react'
import db, { createWord, deleteWord, getBook } from '@/net/db';
import { collection,onSnapshot,DocumentData, doc,getDoc } from 'firebase/firestore';
import { useState,useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import Box from '@mui/material/Box';
import WordTable from '@/components/WordTable';
import BasicSpeedDial from '@/components/BasicSpeedDial';
import AddIcon from '@mui/icons-material/Add';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useTitleContext } from '@/context/TitleContext';
import { useGridApiRef } from '@mui/x-data-grid';

export default function BookPage({
  params
}:{
  params: {bookId:string};
}) {
  
  const {user} = useAuthContext();
  const {setTitle} = useTitleContext();
  const apiRef = useGridApiRef();
  const [words, setWords] = useState<DocumentData | undefined>();
  const [bookData, setBookData] = useState<DocumentData | undefined>();
  
  useEffect(() => {
    if(bookData){ setTitle(bookData.bookName)}
  },[bookData])

  const addWord = async() => {
    try {
      const docRef = await createWord({
        spelling:"apple",
        meaning: "사과",
        bookId: params.bookId
      })
      console.log("Document written with ID: ", docRef);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const deleteWords =async () => {
    const wordIds =  apiRef.current.getSelectedRows();

    wordIds.forEach((word, key) => {
      console.log(word)
      deleteWord({bookId:params.bookId, wordId:word.id})
    })
  
    
  }

  const getBookData = async () => {
    const docRef = await getBook(params.bookId);
    const docData =  await docRef.data();
    docData.id = docRef.id;
    setBookData(docData)
    console.log(bookData)
  }

  

  useEffect(() => {
    getBookData()
    const unsubscribe = onSnapshot(collection(db, 'books',params.bookId,'words'), (querySnapshot) => {
      const words = [];
      querySnapshot.forEach((word) => {
        const data = word.data()
        data.id= word.id;
        words.push(data);
        
      });
      setWords(words)
      console.log(words)
    });
    return unsubscribe
  },[user])

  useEffect(() => {
    console.log(words)
  },[words])


  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper',height:'100%'}}>

      <Box sx={{
      height:'85%',
      position:'relative',
      }}>
        <WordTable rows={words} bookId={params.bookId} apiRef={apiRef}/>
      </Box>

      <Box sx={{
        height:'15%',
        position:'relative',
      }}>
        <BasicSpeedDial actions={[  
        { icon: <AddIcon />, name: 'Add New Word',onClick: addWord },
        { icon: <PlaylistRemoveIcon />, name: 'Delete Selected Words',onClick: deleteWords  }
        ]}/>
      </Box>
    </Box>
  )
}










export function WordDetail ({bookId,wordId}:{bookId:string,wordId:string}) {
  const [wordData, setWordData] = useState<DocumentData | undefined>();


  async function getWordData() {
    const docRef = doc(db,'books',bookId,'words',wordId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setWordData(docSnap.data())
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  useEffect(() => {
    if(bookId && wordId) {
      console.log(bookId,wordId)
      getWordData()
    }
    
  },[bookId,wordId])

  if(!wordId) return <div>선택된 아이템이 없습니다.</div>

  return (
    <div>{wordData && <div>{wordData.spelling}: {wordData.meaning}</div>}</div>
    
  )
}
