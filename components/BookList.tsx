import React from 'react'
import Book from './Book'
import { List } from '@mui/material'

export default function BookList({books}) {

  console.log(books)

  if(!books || books.length < 1) return 'No Books'


  return (
    <List sx={{border: '1px solid #ddd', borderRadius: '6px'}}>
      {books ? books.map(item => <Book key={item.id} data={item}/> ): 'No Books'}
    </List>
  )
}