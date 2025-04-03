import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext'; // Changed from useContext(AuthContext) to useAuth
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

export default function Header() {
  const { isAuthenticated, logout } = useAuth(); // Changed to useAuth hook
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
            Medical Claim Processor
          </Link>
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" href="/dashboard">
            Dashboard
          </Button>
          {isAuthenticated && (
            <Button color="inherit" href="/claims/upload">
              Upload Claim
            </Button>
          )}
          {isAuthenticated ? (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" href="/auth/login">
              Login
            </Button>
          )}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                Dashboard
              </Link>
            </MenuItem>
            {isAuthenticated && (
              <MenuItem onClick={handleClose}>
                <Link href="/claims/upload" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Upload Claim
                </Link>
              </MenuItem>
            )}
            {isAuthenticated ? (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            ) : (
              <MenuItem onClick={handleClose}>
                <Link href="/auth/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Login
                </Link>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}