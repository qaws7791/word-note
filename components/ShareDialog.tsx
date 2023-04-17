import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Switch } from '@mui/material';
import { doCopy } from '@/utils/common';

export default function ShareDialog({
  handleClick, 
  open, 
  setOpen,
  initialValue,
  is_shared,
}:{
  handleClick:Function,
  open:boolean,
  setOpen:React.Dispatch<React.SetStateAction<boolean>>,
  initialValue:string,
  is_shared:boolean,
}) {
  console.log(handleClick)
  const [checked, setChecked] = React.useState(is_shared);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  React.useEffect(() => {
    handleClick(checked)
  },[checked])

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Sharing</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Share the link to learn the vocabulary book with others
          </DialogContentText>
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="URL"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={initialValue}
            InputProps={{readOnly:true}}
          />
          <Button onClick={()=>doCopy(initialValue)}>Copy</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          {/* <Button onClick={handleUpdate} variant='contained' >Rename</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}