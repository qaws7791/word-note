
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
  const [isOpenDrawer, setIsOpenDrawer] = React.useState(false);



  const isLogin = user ? true: false;
  const router = useRouter();


   const handleSignOut = async () => {
    try {
      await logout();
      console.log("Logout Success");
      router.push('/')
    } catch (error) {
      console.log("Logout error: ", getErrorMessage(error));
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  }


  const onKeyDownDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setIsOpenDrawer(true);
  };

  const onOpenDrawer = () => {
    setIsOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

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
            onClick={onOpenDrawer}
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
      <AppBarDrawer open={isOpenDrawer} onClose={onCloseDrawer} onKeyDown={onKeyDownDrawer}/>
    </Box>
  );
}

import Drawer, { DrawerProps } from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import { getErrorMessage } from '@/utils/common';

export function AppBarDrawer({
  open, 
  onClose, 
  onKeyDown
}:{
  open:boolean,
  onClose:(() => void),
  onKeyDown:(event: React.KeyboardEvent | React.MouseEvent)=>void
}) {

  const router = useRouter();

  const pushPage = (url:string) => router.push(`${url}`)

  return(
    <Drawer anchor={'left'} open={open} onClose={onClose}>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onKeyDown}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => pushPage('/profile')}>
              <ListItemIcon>
                  <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={"프로필"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => pushPage('/notes')}>
              <ListItemIcon>
                  <BookIcon />
              </ListItemIcon>
              <ListItemText primary={"노트"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}