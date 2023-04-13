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
import { convertBytesToString } from '@/utils/common';
// 1. 처음 렌더링 -> 입력된 image가 없음 (imageUpload === null)
// 1.1 기존 photoURL이 존재함(user.photoURL !== null) -> photoURL로 img 표시
// 1.2 기존 photoURL이 없음(user.photoURL === null) -> defaultImage로 img 표시

// 2. image를 선택함 (imageUpload !== null) -> setShouldResetURL(false) src=URL.createObjectURL(imageUpload)로 이미지 표시

// 3. 원래대로 버튼 클릭 -> 입력된 이미지 삭제 (setImageUpload(null)) -> 1.으로 돌아감

// 4. 프로필 이미지 지우기 버튼 클릭 - 입력된 이미지 삭제(setImageUpload(null)) 및 photoURL 삭제(setShouldResetURL = true)





export default function ProfileEditPage() {
  const {user} = useAuthContext();
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [shouldResetURL,setShouldResetURL] = useState<boolean>(false)
  const [displayName, setDisplayName] = useState<string>('');
  const [snackbar, setSnackbar] = React.useState<Pick<
  AlertProps,
  "children" | "severity"
> | null>(null);(null);


  const handleCloseSnackbar = ():void => setSnackbar(null);

  const onChangeInputImage = (file:File):void => {
    if(!file) return

    if(file.size > 5_000_000) {
      setSnackbar({ children: "5MB 이하의 이미지만 선택할 수 있습니다. ", severity: "error" });
      return
    }
    setImageUpload(file);
    setShouldResetURL(false);
    setSnackbar({ children: "이미지를 성공적으로 불러왔습니다.", severity: "info" });
  } 


  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>):Promise<void> => {
    event.preventDefault()
    if (!user) return
    const NewUser = { displayName: user.displayName, photoURL: user.photoURL};
    if(shouldResetURL) NewUser.photoURL = '';
    if(imageUpload) await uploadImage(imageUpload).then((url) => NewUser.photoURL = url);
    if(displayName !== user.displayName) NewUser.displayName = displayName;
    console.log(NewUser)
    await updateProfile(user,NewUser).then(() => {
      console.log("Profile updated!",user)
      setSnackbar({ children: "성공적으로 프로필을 변경했습니다.", severity: "success" });
    }).catch((error) => {
      console.error('error: ',error)
      setSnackbar({ children: `error: ${error}`, severity: "error" });
    });
  }

  const loadDefaultImage = async():Promise<void> => {
    const blob =await downloadDefaultProfileImage()
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.addEventListener('load', () => {
      localStorage.setItem('defaultProfile', reader.result);
    });
  }

  const resetToDefaultImage = ():void => {
    setImageUpload(null); 
    setShouldResetURL(true)
  }

  useEffect(() => {
    if(user?.displayName) {setDisplayName(user?.displayName)}
    if(user && !user.photoURL) {
      console.log('프로필 이미지가 없습니다.') 
    }
    loadDefaultImage()
  },[])

  const imageURL = imageUpload 
  ? URL.createObjectURL(imageUpload) :
   user?.photoURL && !shouldResetURL 
  ? user?.photoURL :  localStorage.getItem('defaultProfile');
  

  
  return (
    <>
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
    <Stack direction="column" alignItems="center" spacing={2}>
    {<img src={`${imageURL}`} width={200} height={200} />}
      <Button variant="outlined" component='label'>
        {imageUpload ? '이미지 변경' : '이미지 선택'}
        <input hidden accept="image/*" type="file" onChange={(event) => {console.log(event); onChangeInputImage(event.target.files[0])}} />
      </Button>
      <Button variant="outlined" onClick={resetToDefaultImage}>
        기본 이미지 사용
      </Button>
      <Typography>file: {imageUpload ? imageUpload.name :" "}</Typography>
      <Typography>size: {imageUpload ? convertBytesToString(imageUpload.size) :" "}</Typography>
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
