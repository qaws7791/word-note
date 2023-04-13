"use client"
import { useAuthContext } from '@/context/AuthContext'
import React,{use, useEffect, useState} from 'react'
import db, { getBooksAll } from '@/net/db';
import { getCountFromServer, query, where } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
const WEEK = 7 * 24 * 60 * 60 * 1000;
const DAY =  1 * 60 * 60 * 1000;

export default function ProfilePage() {
  const {user} = useAuthContext();
  const [ books,setBooks] = useState([]);
  const [totalWordNumber, setTotalWordNumber] = useState(0);
  const [totalBananaNumber, setTotalBananaNumber] = useState(0);

  const loadBooks = async(uid) => {
    const newBooks = [];
    console.log('start')
    const querySnapshot  = await getBooksAll({uid:uid})
    console.log(querySnapshot)
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      // doc.data() is never undefined for query doc snapshots
      newBooks.push(data);
    });
    console.log(newBooks)
    setBooks(newBooks)
  }

  const getLastWeek = () => {
    return new Date().getTime() - WEEK;    
  }

  const getLastDay = () => {
    return new Date().getTime() - DAY;    
  }

  useEffect(() => {
    if (!user) return
    loadBooks(user.uid)
    
  },[])

  useEffect(() => {
    if(books) {
      printTotalWord()
      printLastWeekWord()
    }
  },[books])


  useEffect(() => {
    console.log(totalWordNumber)
  },[totalWordNumber])
  


  const printTotalWord = async () => {

    if(!books) {
      console.log('no books') 
      return 
    }
    let sum  = 0;
    //map,foreach,reduce x
    // await books.map( async(doc) => {
    //   const coll = collection(db,'books',doc.id,'words');
    //   const snapshot = await getCountFromServer(coll);
    //   const count =  snapshot.data().count;
    //   console.log('count: ', count);
    //   sum += count;
    //   console.log(sum)
    // })

    //비동기 기다림
    for await ( const book of books) {
      const coll = collection(db,'books',book.id,'words');
      const snapshot = await getCountFromServer(coll);
      const count =  snapshot.data().count;
      console.log('count: ', count);
      sum += count;
      console.log(sum)
    }
    
    setTotalWordNumber(sum)

  }

  const printLastWeekWord = async () => {

    if(!books) {
      console.log('no books') 
      return 
    }
    let sum  = 0;
    //map,foreach,reduce x
    // await books.map( async(doc) => {
    //   const coll = collection(db,'books',doc.id,'words');
    //   const snapshot = await getCountFromServer(coll);
    //   const count =  snapshot.data().count;
    //   console.log('count: ', count);
    //   sum += count;
    //   console.log(sum)
    // })

    //비동기 기다림
    for await ( const book of books) {
      const coll = collection(db,'books',book.id,'words');
      const lastWeek = getLastWeek();
      const q = query(coll,where("created_at",">=",lastWeek))
      const snapshot = await getCountFromServer(q);
      const count =  snapshot.data().count;
      console.log('count: ', count);
      sum += count;
      console.log(sum)
    }
    
    setTotalBananaNumber(sum)

  }

  return (<>
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 240,
        }}
      >
        <Item 
        title={'지금까지 내가 저장한 단어는?'} 
        content={`${totalWordNumber} 개`}
        hint={'더 많은 단어를 저장 해 보세요!'}
        linkTitle={'단어장으로 이동'}
        />
      </Paper>
    </Grid>
    <Grid item xs={12} md={6}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 240,
        }}
      >
        <Item 
        title={'최근 일주일간 저장한 단어는?'} 
        content={`${totalBananaNumber} 개`}
        hint={'더 많은 단어를 저장 해 보세요!'}
        linkTitle={'단어장으로 이동'}
        />
      </Paper>
    </Grid>
    <Grid item xs={12} md={6}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 240,
        }}
      >
        <Item 
        title={'내가 저장한 단어'} 
        content={`${totalWordNumber} 개`}
        hint={'더 많은 단어를 저장 해 보세요!'}
        linkTitle={'단어장으로 이동'}
        />
      </Paper>
    </Grid>
    <Grid item xs={12} md={6}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 240,
        }}
      >
        <Item 
        title={'내가 저장한 단어'} 
        content={`${totalWordNumber} 개`}
        hint={'더 많은 단어를 저장 해 보세요!'}
        linkTitle={'단어장으로 이동'}
        />
      </Paper>
    </Grid>
  </Grid>

    </>
  )
}

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@/components/Link';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}



export function Item({title,content,hint,linkTitle}) {

  const onClickLink = () => {
  
  }

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Typography component="p" variant="h4">
        {content}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {hint}
      </Typography>
      <div>
        <Link color="primary" href="/notes">
          {linkTitle}
        </Link>
      </div>
    </React.Fragment>
  );
}

import Typography from '@mui/material/Typography';

interface TitleProps {
  children?: React.ReactNode;
}

export function Title(props: TitleProps) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}