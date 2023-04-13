import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({
  handleClick, 
  open, 
  setOpen,
  initialValue
}:{
  handleClick:Function,
  open:boolean,
  setOpen:React.Dispatch<React.SetStateAction<boolean>>,
  initialValue:string
}) {
  const [input, setInput] = React.useState(initialValue)
  console.log(handleClick)

  function handleUpdate() {
    handleClick(input);
    setOpen(false)
  }
  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Renaming</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Enter the name of the book you want to change.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Book name"
            type="text"
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant='contained' >Rename</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}