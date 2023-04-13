import React from 'react'
import Book from './Book'
import { List } from '@mui/material'
import { DocumentData } from 'firebase/firestore'

export default function BookList({books}:{books:DocumentData[]| undefined}) {

  console.log(books)

  


  return (
    <List sx={{border: '1px solid #ddd', borderRadius: '6px'}}>

      {books ? books.map(item => <Book key={item.id} data={item}/> ): 'No Books'}
    </List>
  )
}