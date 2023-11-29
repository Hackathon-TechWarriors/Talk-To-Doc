import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import React from "react";
import { styled } from "@mui/material/styles";

export function Uploader({setFiles=()=>{},files=[]}) {
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFiles([...files,file]);
  };
  return (
    <>
      <Grid
        container
        spacing={5}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid item xs={12} md={12} sm={12} lg={12} justifySelf={"center"}>
          <IconButton
            color="primary"
            size="large"
            aria-label="add to shopping cart"
          >
            <CloudUploadOutlinedIcon
              style={{ width: 80, height: 80, color: "#86bc25" }}
            ></CloudUploadOutlinedIcon>
          </IconButton>
        </Grid>
        <Grid item xs={12} md={12} sm={12} lg={12} justifySelf={"center"}>
          <Typography variant="h6">UPLOAD FILES</Typography>
          <Button
            style={{ paddingLeft: 60, paddingRight: 60, background: "#86bc25" }}
            variant="contained"
            component="label"
          >
            BROWSE
            <VisuallyHiddenInput type="file" onChange={handleFileInputChange} />
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1
});

