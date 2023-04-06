"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { 
  DataGrid, 
  GridColDef,
  GridToolbarQuickFilter,
  GridRenderCellParams,
  useGridApiContext
} from '@mui/x-data-grid';
import { updateWord } from '@/net/db';
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";


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

const columns: GridColDef[] = [
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
    renderCell: renderRating,
    renderEditCell: renderRatingEditInputCell,
    editable: true,
    width: 150,
    type: 'number',
  },
];

// const rows = [
// {created_at: 1680541319787,id:"18QftO3OuZvRAE3QHCAv", meaning: "사과", spelling: "apple"},
// {created_at: 1680541318191,id:"clMxOaNgXBMjazcQLYK6", meaning: "사과", spelling: "apple"},
// {created_at: 1680541318865,id:"jzWXPdekM01YCfKJsm6a", meaning: "사과", spelling: "apple"},
// ];

export default function WordTable({rows,bookId,apiRef}) {
  
  const [snackbar, setSnackbar] = React.useState<Pick<
  AlertProps,
  "children" | "severity"
> | null>(null);(null);

  const handleCloseSnackbar = () => setSnackbar(null);


  const processRowUpdate = async(newRow,prevRow) => {
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
          selectedIDs.has(row.id.toString())
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
    </>
  );
}

function SearchBar() {
  return (<GridToolbarQuickFilter  sx={{padding:1,width:'80%'}}/>)
}