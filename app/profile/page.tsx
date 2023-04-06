"use client"
import React,{useState,useEffect} from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { downloadDefaultProfileImage, uploadImage } from '@/net/storage';
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useAuthContext } from '@/context/AuthContext';
import Typography from '@mui/material/Typography';
import { Box } from "@mui/material";
import { updateProfile } from 'firebase/auth';
import TextField from "@mui/material/TextField/TextField";

// 1. 처음 렌더링 -> 입력된 image가 없음 (imageUpload === null)
// 1.1 기존 photoURL이 존재함(user.photoURL !== null) -> photoURL로 img 표시
// 1.2 기존 photoURL이 없음(user.photoURL === null) -> defaultImage로 img 표시

// 2. image를 선택함 (imageUpload !== null) -> setShouldResetURL(false) src=URL.createObjectURL(imageUpload)로 이미지 표시

// 3. 원래대로 버튼 클릭 -> 입력된 이미지 삭제 (setImageUpload(null)) -> 1.으로 돌아감

// 4. 프로필 이미지 지우기 버튼 클릭 - 입력된 이미지 삭제(setImageUpload(null)) 및 photoURL 삭제(setShouldResetURL = true)



const KB = 1024;
const MB = 1024**2

export default function ProfilePage() {
  const {user} = useAuthContext();
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [shouldResetURL,setShouldResetURL] = useState<boolean>(false)
  const [displayName, setDisplayName] = useState<string>('');
  const [snackbar, setSnackbar] = React.useState<Pick<
  AlertProps,
  "children" | "severity"
> | null>(null);(null);

const convertbitToMb = (bytes) => {
  const size_KB = bytes / KB;
  const size_MB = bytes / MB;

  if(size_MB > 1 ) return Math.ceil(size_MB * 1000) / 1000 +"MB";
  return Math.ceil(size_KB * 1000) / 1000 +"KB";
}


  const handleCloseSnackbar = () => setSnackbar(null);

  const handleChangeInputImage = (file:File) => {
    if(!file) return

    if(file.size > 5_000_000) {
      setSnackbar({ children: "5MB 이하의 이미지만 선택할 수 있습니다. ", severity: "error" });
      return
    }
    setImageUpload(file);
    setShouldResetURL(false);
    setSnackbar({ children: "이미지를 성공적으로 불러왔습니다.", severity: "success" });
  } 

  const handleUpload = async() => {
    if(imageUpload == null) return user?.photoURL;
    const result = await uploadImage(imageUpload)
    return result
  }

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return
    const NewUser = { displayName: user.displayName, photoURL: user.photoURL};
    if(shouldResetURL) NewUser.photoURL = '';
    if(imageUpload) await uploadImage(imageUpload).then((url) => {console.log(url); NewUser.photoURL = url});
    if(displayName !== user.displayName) NewUser.displayName = displayName;
    console.log(NewUser)
    await updateProfile(user,NewUser).then(() => {
      // Profile updated!
      // ...
      console.log("Profile updated!")
      console.log(user)
    }).catch((error) => {
      // An error occurred
      // ...
    });
  }

  const loadDefaultImage = async() => {
    const blob =await downloadDefaultProfileImage()
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.addEventListener('load', () => {
      localStorage.setItem('defaultProfile', reader.result);
    });
  }

  const resetToDefaultImage = () => {
    setImageUpload(null); 
    setShouldResetURL(true)
  }

  useEffect(() => {
    if(user?.displayName) {setDisplayName(user?.displayName)}
    if(user && !user.photoURL) {
      console.log('프로필 이미지가 없습니다.')
      loadDefaultImage()
    }
    
  },[])

  const imageURL = imageUpload 
  ? URL.createObjectURL(imageUpload) :
   user?.photoURL && !shouldResetURL 
  ? user?.photoURL :  localStorage.getItem('defaultProfile');
  

  useEffect(() => {
    console.log(imageURL)
  })

  
  return (
    <>
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
    <Stack direction="column" alignItems="center" spacing={2}>
    {<img src={`${imageURL}`} width={200} height={200} />}
      <Button variant="outlined" component='label'>
        {imageUpload ? '이미지 변경' : '이미지 선택'}
        <input hidden accept="image/*" type="file" onChange={(event) => {console.log(event); handleChangeInputImage(event.target.files[0])}} />
      </Button>
      <Button variant="outlined" onClick={resetToDefaultImage}>
        기본 이미지 사용
      </Button>
      <Typography>file: {imageUpload ? imageUpload.name :" "}</Typography>
      <Typography>size: {imageUpload ? convertbitToMb(imageUpload.size) :" "}</Typography>
      <TextField
        margin="normal"
        required
        id="displayName"
        label="displayName"
        name="displayName"
        autoFocus
        value={displayName}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setDisplayName(event.target.value);
        }}
      />
      <Button variant='contained' type="submit">save profile</Button>

      
    </Stack>
    </Box>
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
  )
}
