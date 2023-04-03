'use client'
import React, { use } from 'react'
import db, { createWord, getBook, getWord } from '@/net/db';
import { collection,onSnapshot,DocumentData, doc,getDoc } from 'firebase/firestore';
import { useState,useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@mui/material';

export default function BookPage({
  params
}:{
  params: {id:string};
}) {
  const {user, setUser} = useAuthContext();
  const [words, setWords] = useState();
  const [bookData, setBookData] = useState<DocumentData | undefined>();
  const [selectedId, setSelectedId] = useState();


  const addWord = async() => {
    try {
      const docRef = await createWord({
        spelling:"apple",
        meaning: "사과",
        bookId: params.id
      })
      console.log("Document written with ID: ", docRef);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const getBookData = async () => {
    const docRef = await getBook(params.id);
    const docData =  await docRef.data();
    docData.id = docRef.id;
    setBookData(docData)
  }

  useEffect(() => {
    getBookData()
    const unsubscribe = onSnapshot(collection(db, 'books',params.id,'words'), (querySnapshot) => {
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


  return (
    <div>
      {bookData && bookData.bookName}
      <WordDetail bookId={params.id} wordId={selectedId}/>
      {words && words.map((word) => <li key={word.id} onClick={() => setSelectedId(word.id)}>{word.spelling}: {word.meaning}</li>)}
      <Button onClick={addWord}>생성</Button>
      </div>
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
