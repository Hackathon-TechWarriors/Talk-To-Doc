import { AppBar, Box, Toolbar } from "@mui/material";
import React from "react";
import { Logo } from "./Logo";

export function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="fixed" style={{ background: "#212529" }}>
        <Toolbar>
          <Logo/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
