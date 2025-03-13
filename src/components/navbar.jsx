import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';

export function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Menu Button (Visible only on small screens) */}
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" }, mr: 2 }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="div"
            sx={{ flexGrow: 1 }}
            variant="subtitle1"
            className="animate__animated animate__rubberBand text-uppercase"
          >
            Intimation Calculator
          </Typography>

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Link to='/admin-login'>
            <Button
              className="animate__animated animate__bounceInDown fw-bold"
              variant="contained"
              color="secondary"
            >
             <span className="mx-2"><LoginIcon /></span> Admin Login 
            </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List>
          <ListItem button onClick={() => setDrawerOpen(false)}>
           <Link to="/admin-login"> 
            <Button variant="contained" color="secondary"> <span className="mx-2"><LoginIcon /></span><ListItemText primary="Admin Login" /></Button>
           </Link>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
