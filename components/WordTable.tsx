"use client"
import * as React from 'react';
import { DataGrid, GridColDef,GridToolbarQuickFilter  } from '@mui/x-data-grid';
import { updateWord } from '@/net/db';
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const columns: GridColDef[] = [
  { field: 'spelling', headerName: 'Word', width: 130, editable: true },
  { field: 'meaning', headerName: 'Meaning',description:'설명', width: 130,editable: true },
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