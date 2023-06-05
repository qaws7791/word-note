import { getPublicBook, getPublicWords } from '@/net/db'
import React from 'react'
import styles from './page.module.css'

const formatDate = (timestamp:number):string => {
  const dateObject = new Date(timestamp);
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1;
  const date = dateObject.getDate();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();

  return `${year}년 ${month}월 ${date}일 ${hours}:${minutes}:${seconds}`;
}


export default async function page({params}:{params:{url:string}}) {
  
  
  console.log('hi')
  const book =await getData(params.url)
  if(book.length < 1) {
    return <p>No response</p>
  }
  const words = await getWords(book[0].id)
  console.log(words)

  return (
    <div className={styles.page}>
      <h1>{book[0].bookName} </h1>
      <h3>by {book[0].authorName}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>단어</th>
            <th>설명</th>
            <th>난이도</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word) => 
            <tr key={word.id}>
                <td>{word.spelling}</td>
                <td>{word.meaning}</td>
                <td><StarRating rating={word.rating}/></td>
                <td>{formatDate(word.created_at)}</td>
            </tr>
          )}
        </tbody>

            </table>
      </div>
  )
}

const getData = async(url:string)=> {
  return await getPublicBook(url);
}

const getWords = async(bookId:string) => {
  return await getPublicWords(bookId)
}

function StarRating({ rating }:{rating:number}) {
  let stars = [];
  for (let i = 1; i <= rating; i++) {
    stars.push(<div style={{width:'24px',height:'24px', display:'inline-block'}}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      style={{fill:'#faaf00'}}>
      <path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path>
    </svg>
  </div>);
  }
  return (
    <div>{stars}</div>
  );
}