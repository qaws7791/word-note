
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { logout } from '@/net/auth';
import { TitleContextProvider, useTitleContext } from '@/context/TitleContext';
import Tooltip from '@mui/material/Tooltip';

export default function ProfileAppBar() {
  const {user} = useAuthContext();
  const {title} = useTitleContext();

  const isLogin = user ? true: false;
  const router = useRouter();


   const handleSignOut = async () => {
    try {
      await logout();
      console.log("Logout Success");
      router.push('/')
    } catch (e) {
      console.log("Logout error: ", e.message);
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  }


  return (
    <Box sx={{ position:'fiexed', width:'100%' }}>
      <AppBar position="static">
        <Toolbar variant='dense'>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title ? title : "App"}
          </Typography>

          {
          user &&
          <Tooltip title={user?.displayName || user!.email!} onClick={e=>router.push('/profile')}>
            <IconButton  sx={{ mr:1 }}>
                  <Avatar alt={user?.displayName ? user.displayName : user!.email!} src={user?.photoURL || ''} />
            </IconButton>
          </Tooltip>
          }

          {isLogin ? 
          <Button color="inherit" onClick={handleSignOut}>Logout</Button> 
          : 
          <Button color="inherit" onClick={handleSignIn}>Login</Button>
          }
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}