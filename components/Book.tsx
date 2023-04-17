import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { deleteBook, updateBook, updateBookShareState } from "@/net/db";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import BookMenu from "./BookMenu";
import RenameDialog from "./RenameDialog";
import { DocumentData } from "firebase/firestore";
import ShareDialog from "./ShareDialog";

export default function Book({data}:{data:DocumentData}) {
  const {user} = useAuthContext();
  const [inputBookName, setInputBookName] = useState(data.bookName);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  async function handleDeleteBook() {
    return await deleteBook(data.id);
  }

  function onChangeInput (e:React.ChangeEvent<HTMLInputElement>){
    setInputBookName(e.target.value);
  }

  function handleUpdateBook (id:string){
    return async function (bookName:string) {
        await updateBook({
          bookName:bookName, 
          id: id
        });
    }
  }

  function handleShareBook (id:string) {
    return async function (is_shared:boolean) {
      await updateBookShareState({
        is_shared:is_shared,
        id:id
      })
    }
  }

  return(
    <ListItem disablePadding>
      <ListItemButton component={Link} href={`/${data.id}`}>
        <ListItemText primary={data.bookName} sx={{textAlign: 'center'}}/>
      </ListItemButton>
      <BookMenu 
      handleDeleteBook={handleDeleteBook} 
      setDialogOpen={setDialogOpen} 
      setShareDialogOpen ={setShareDialogOpen}
      />
      <RenameDialog 
      handleClick={handleUpdateBook(data.id)} 
      open={dialogOpen} 
      setOpen={setDialogOpen} 
      initialValue={data.bookName}/>
      <ShareDialog 
      handleClick={handleShareBook(data.id)} 
      open={shareDialogOpen} 
      setOpen={setShareDialogOpen} 
      initialValue={data.public_url}
      is_shared={data.is_shared}
      />

    </ListItem>
    )
}


