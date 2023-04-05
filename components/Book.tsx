import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { deleteBook, updateBook } from "@/net/db";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import BookMenu from "./BookMenu";
import FormDialog from "./FormDialog";

export default function Book({data}) {
  const {user} = useAuthContext();
  const [inputBookName, setInputBookName] = useState(data.bookName);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleDeleteBook() {
    return await deleteBook(data.id);
  }

  function onChangeInput (e:React.ChangeEvent<HTMLInputElement>){
    setInputBookName(e.target.value);
  }

  function handleUpdateBook (id){
    return async function (bookName) {
        await updateBook({
          bookName:bookName, 
          id: id
        });
    }
  }

  return(
    <ListItem disablePadding>
      <ListItemButton component={Link} href={`/${user.uid}/${data.id}`}>
        <ListItemText primary={data.bookName} sx={{textAlign: 'center'}}/>
      </ListItemButton>
      <BookMenu handleDeleteBook={handleDeleteBook} setDialogOpen={setDialogOpen} />
      <FormDialog 
      handleClick={handleUpdateBook(data.id)} 
      open={dialogOpen} 
      setOpen={setDialogOpen} 
      initialValue={data.bookName}/>
    </ListItem>
    )
}

