"use client";
import { ReactElement } from "react";
import { signIn } from "@/net/auth";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import NextLink from "next/link";
import Button from "@mui/material/Button/Button";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar/Avatar";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography/Typography";
import TextField from "@mui/material/TextField/TextField";
import Grid from '@mui/material/Grid';
import Link from "@mui/material/Link";


export default function LoginForm(): ReactElement {
  const router = useRouter();
  const {setUser} = useAuthContext();


  const handleSubmit =async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')?.toString()
    const password = data.get('password')?.toString()

    if (!email)  throw new Error('이메일을 입력하세요.');
    if (!password) throw new Error('비밀번호를 입력하세요')

    try {
      const user = await signIn({email, password});
      console.log('Login Success', user);
      setUser(user);
      router.push(`/${user.uid}`)
    } catch (e: any) {
      console.log('Login Error', e.message);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
      <LockOutlinedIcon/>
    </Avatar>
    <Typography component="h1" variant="h5">
      Sign in
    </Typography>
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1}}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
      <Grid container>
              <Grid item xs>
                <Link href="/signup"  component={NextLink} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
        </Grid>
    </Box>
    </Box>
  );
}