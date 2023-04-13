"use client"
import React, {useState,useEffect, useRef} from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { 
  DataGrid, 
  GridColDef,
  GridToolbarQuickFilter,
  GridRenderCellParams,
  useGridApiContext,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { updateWord } from '@/net/db';
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button"



function renderRating(params: GridRenderCellParams<any, number>) {
  return <Rating readOnly value={params.value} />;
}

function RatingEditInputCell(props: GridRenderCellParams<any, number>) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (event: React.SyntheticEvent, newValue: number | null) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  const handleRef = (element: HTMLSpanElement) => {
    if (element) {
      const input = element.querySelector<HTMLInputElement>(
        `input[value="${value}"]`,
      );
      input?.focus();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
      <Rating
        ref={handleRef}
        name="rating"
        precision={1}
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
}

const renderRatingEditInputCell: GridColDef['renderCell'] = (params) => {
  return <RatingEditInputCell {...params} />;
};


// const rows = [
// {created_at: 1680541319787,id:"18QftO3OuZvRAE3QHCAv", meaning: "사과", spelling: "apple"},
// {created_at: 1680541318191,id:"clMxOaNgXBMjazcQLYK6", meaning: "사과", spelling: "apple"},
// {created_at: 1680541318865,id:"jzWXPdekM01YCfKJsm6a", meaning: "사과", spelling: "apple"},
// ];

export interface Word extends DocumentData {
  id?: string;
  created_at?: number;
  meaning?: string;
  rating?: number;
  spelling?: string;
}

export default function WordTable({
  rows,
  bookId,
  apiRef
}:{
  rows:Word[] | undefined,
  bookId:string,
  apiRef:React.MutableRefObject<GridApiCommunity>
  }
  ) {
  const [isOpenModal,setIsOpenModal] = useState<GridValidRowModel | null>(null);
  const [snackbar, setSnackbar] = React.useState<Pick<
  AlertProps,
  "children" | "severity"
> | null>(null);(null);
const [ columns,setColumns ] = useState<GridColDef[]>([])

  const handleCloseSnackbar = () => setSnackbar(null);


  const processRowUpdate = async(newRow: any,prevRow:any) => {
    console.log(newRow)
    const response = await updateWord({
      bookId, 
      wordId: newRow.id,
      spelling: newRow.spelling,
      meaning: newRow.meaning,
      rating: newRow.rating
    });
    setSnackbar({ children: "변경사항이 저장되었습니다.", severity: "success" });

    return response
  }

  const handleProcessRowUpdateError =(error:Error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }

  const addColumn = (col:GridColDef) => {
    columns.push(col)
  }

  useEffect(() => {
    // const Rows = gridFilteredSortedRowIdsSelector(apiRef);
    // const allRows = apiRef.current.getSortedRows(apiRef)
    // console.log(Rows)
    // console.log(allRows)
    setColumns([
      { 
        field: 'spelling', 
        headerName: '단어', 
        description: '설명할 단어',
        width: 130, 
        editable: true 
      },
      { 
        field: 'meaning', 
        headerName: '설명',
        description:'단어에 대한 뜻이나 설명', 
        width: 130,
        editable: true 
      },
      {
        field: 'rating',
        headerName: '난이도',
        description:'난이도',
        headerAlign: 'center',
        renderCell: renderRating,
        renderEditCell: renderRatingEditInputCell,
        editable: true,
        width: 150,
        type: 'number',

      },
      {
        field: "change",
        headerName: "수정",
        headerAlign: 'center',
        width: 90,
        renderCell: (params) => {
          console.log('params:',params)
          return <Button variant='outlined' onClick={(e)=>setIsOpenModal(params.row)}>수정</Button>
        } 
      }
    ])
  },[])



  const handleModalClose = () => {
    setIsOpenModal(null)
  }

  const handleNextWord = () => {
    if(!isOpenModal) return

    console.log(isOpenModal.id) 
    const allRows = apiRef.current.getSortedRows() 
    const index = allRows.findIndex((row) => row.id === isOpenModal.id);

    if(index < 0) return
    console.log(index,allRows.length)
    if(index+1 < allRows.length) {
      console.log(allRows[index+1])
      setIsOpenModal(allRows[index+1])
    }
    return
    
  }

  const handlePrevWord = () => {
    if(!isOpenModal) return

    console.log(isOpenModal.id) 
    const allRows = apiRef.current.getSortedRows() 
    const index = allRows.findIndex((row) => row.id === isOpenModal.id);

    console.log(index,allRows.length)
    if(index-1 >= 0) {
      console.log(allRows[index-1])
      setIsOpenModal(allRows[index-1])
    }
    return
    
  }


  if(!rows) return <div>loading...</div>
  return (
    <>
      <DataGrid

        apiRef={apiRef}
        rows={rows}
        columns={columns}
        checkboxSelection
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        onRowSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          const selectedRowData = rows.filter((row) =>
          selectedIDs.has(row.id!.toString())
          );
          console.log(selectedRowData)
        }}
        slots={{ toolbar: SearchBar  }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      {isOpenModal && 
      <FullScreenDialog 
      bookId={bookId} 
      data={isOpenModal} 
      handleClose={handleModalClose}
      setSnackbar={setSnackbar}
      handleNextWord={handleNextWord}
      handlePrevWord={handlePrevWord}
      
      />
      }
    </>
  );
}


function SearchBar() {
  return (<GridToolbarQuickFilter  sx={{padding:1,width:'80%'}}/>)
}



import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { DocumentData } from 'firebase/firestore';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//전제: Dialog는 word에 대한 데이터를 props로 받는다
// Dialog에서 다음 페이지를 클릭하면 -> wordTable에서 주는 props 데이터가 다음 데이터로 변경되면 된다.
// DataGrid는 정렬이 가능하므로 정렬된 상태에서 다음 word 데이터를 찾아야 한다,.


export function FullScreenDialog({
  bookId,
  handleClose,
  data,
  setSnackbar,
  handleNextWord,
  handlePrevWord
}:{
  bookId:string,
  handleClose: () => void,
  data:GridValidRowModel ,
  setSnackbar:React.Dispatch<React.SetStateAction<Pick<AlertProps, "children" | "severity"> | null>>,
  handleNextWord: () => void,
  handlePrevWord: () => void
}) {
  const open = Boolean(data)
  const [spellingInput, setSpellingInput] = useState(data.spelling);
  const [meaningInput, setMeaningInput] = useState(data.meaning);
  const [ratingInput, setRatingInput] = useState<number | null>(+data.rating);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const spelling = formData.get('spelling')?.toString();
    const meaning = formData.get('meaning')?.toString();
    const rating = Number(formData.get('rating'));
    const newWord = {bookId:bookId, wordId: data.id};

    const response = await updateWord({
      bookId, 
      wordId: data.id,
      spelling:spelling,
      meaning: meaning,
      rating: rating
    });
    setSnackbar({ children: "변경사항이 저장되었습니다.", severity: "success" });
  }

  useEffect(()=>{
    setSpellingInput(data.spelling)
    setMeaningInput(data.meaning)
    setRatingInput(data.rating)
  },[data])

  const onChangeMeaningInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    if(newValue.length > 100) {
      setMeaningInput(newValue.slice(0,100))
      return
    }
    
    setMeaningInput(newValue)

  }


  return (
    <Box sx={{width:'100%',height:'100%'}}>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1}}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Sound
            </Typography>
            <Button autoFocus color="inherit" type='submit'>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{
          textAlign:'center', 
          display:'flex',
          flexDirection:'column',
          padding:'30px',
          maxWidth:'600px',
          margin:'0 auto'
        }}>

        
          <Typography variant="h1" gutterBottom>
            {data.spelling}
          </Typography>
          <TextField
            required
            id="outlined-required"
            label="단어"
            name='spelling'
            value={spellingInput}
            onChange={e=>setSpellingInput(e.target.value)}

          />
          <Divider sx={{my: 4}}/>
          <TextField
            required
            id="outlined-required"
            label="설명"
            name='meaning'
            multiline
            maxRows={5}
            value={meaningInput}
            onChange={onChangeMeaningInput}
          />
          <Divider sx={{my: 4}}/>
          <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
          <Rating  name='rating' value={ratingInput} onChange={(event,newValue)=>setRatingInput(newValue)}/>
          {ratingInput !== null && (<Box sx={{ ml: 2 }}>{ratingInput}점</Box>)}
          </Box>
          
          <Grid container spacing={2} sx={{mt:3}}>
            <Grid item xs={6}>
              <Button variant='contained' fullWidth onClick={e=>handlePrevWord()} startIcon={<NavigateBeforeIcon/>}>Prev</Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant='contained' fullWidth onClick={e=>handleNextWord()} endIcon={<NavigateNextIcon/>}>Next</Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      </Dialog>
    </Box>
  );
}