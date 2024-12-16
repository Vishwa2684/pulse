import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  CssBaseline,
  Menu,
  MenuItem,
  Avatar,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Person } from '@mui/icons-material'; // Import the Person icon
import { auth, onAuthStateChanged, signOut } from '../../config/config'; // Import Firebase functions
import logo from '../../assets/pulse_logo.png';
import backgroundImage from '../../assets/main page/backgroundimg.png';
import MeetTheTeam from '../Team/MeetTheTeam';
import robotHandImage from '../../assets/main page/htggdjhdfg 1.png';
import circuitOverlay from '../../assets/main page/surface.png';
import blackOverlay from '../../assets/main page/Rectangle 12.png';
import AboutUs from '../About-us/AboutUs';
import './Main.css';
import Footer from '../CopyRights/Footer';
import WhatPulseAiCanDo from '../WhatPulse/WhatPulseAICanDo';
import TryPulse from '../PulseComp/TryPulse';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
    },
    primary: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
        },
      },
    },
  },
});

const Main = () => {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const logOut = () => {
    signOut(auth).then(() => {
      console.log('Logged out successfully.');
      nav('/login');
    });
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    nav('/login');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className='mainFlex'>
        <AppBar position='sticky' sx={{ zIndex: 1201, padding: '10px' }}>
          <Toolbar sx={{ padding: 0.5 }}>
            <div className='logoDesign'>
              <img src={logo} alt='logo' />
              <Typography variant='h6' component='div' align='center'>
                Pulse AI
              </Typography>
            </div>
            <Box ml='auto'>
              {!user ? (
                <Button color='inherit' onClick={handleLoginClick}>Login</Button>
              ) : (
                <>
                  <Avatar
                    onClick={handleMenu}
                    style={{ cursor: 'pointer', backgroundColor: user.photoURL ? 'transparent' : '#2196f3' }}
                    src={user.photoURL || undefined} 
                    alt={user.displayName || user.email} 
                  >
                    {!user.photoURL && <Person />} 
                  </Avatar>
                  <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem onClick={handleClose} component={Link} to='/profile'>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={logOut}>Log out</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <div
          className='hero-section'
          style={{
            backgroundImage: `url(${blackOverlay}), url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
          }}
        >
          <div className='content'>
            <img src={circuitOverlay} alt='Circuit Overlay' className='circuit-overlay' />
            <img src={robotHandImage} alt='Robot Hand' className='robot-hand' />
            <div className='circuit-text'>Pulse AI</div>
            <h1 className='typing'>Welcome to</h1>
            <p className='fade-in-text'>
              Experience the next wave of technology with Pulse AI. Our innovative platform harnesses the power of
              artificial intelligence to bring you intuitive, intelligent solutions that simplify your daily life. From
              real-time insights to personalized AI assistance, Pulse AI transforms the way you interact with
              technology.
            </p>
            <div className='buttons'>
              <Link to='/messages' style={{ textDecoration: 'none' }}>
                <button className='animated-button' onClick={() => console.log('Chatbot Opened')}>
                  Open Chatbot
                </button>
              </Link>
              <Link to='/voice' style={{ textDecoration: 'none' }}>
                <button className='animated-button' onClick={() => console.log('Exploring Intelligence')}>
                  Explore Intelligence
                </button>
              </Link>
            </div>
          </div>
        </div>
        <AboutUs />
        <MeetTheTeam />
        <WhatPulseAiCanDo />
        <TryPulse />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Main;
