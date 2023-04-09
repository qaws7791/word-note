"use client"
import { Container, CssBaseline,createTheme,ThemeProvider } from '@mui/material';
import './globals.css'
import { AuthContextProvider } from "@/context/AuthContext";
import ProfileAppBar from '@/components/ProfileAppBar';
import { TitleContextProvider } from '@/context/TitleContext';
import Box from '@mui/material/Box';



const AppBarHeight = 60;

const theme = createTheme({
  components: {
      MuiToolbar: {
          styleOverrides: {
              dense: {
                  height: AppBarHeight,
                  minHeight: 60
              }
          }
      }
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <ThemeProvider theme={theme}>
          <TitleContextProvider>
          <ProfileAppBar/>
          <Container fixed sx={{height:`calc(100% - ${AppBarHeight}px)`}}>
            
            
            <Box sx={{padding:1,height: `100%`,border:'0px solid red',position:'relative'}}>
            {children}
            </Box>
            
            <CssBaseline/>
          </Container>
          </TitleContextProvider>
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}
