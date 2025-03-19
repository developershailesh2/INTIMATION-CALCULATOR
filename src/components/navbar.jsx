import React, { useEffect, useState } from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            component="div"
            sx={{ flexGrow: 1 }}
            variant="subtitle1"
            className="animate__animated animate__rubberBand text-uppercase"
          >
            Intimation Calculator
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
