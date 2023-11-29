import React from "react";
import { Grid } from "@mui/material";
import FileUploader from "./FileUpload";

export function Upload({
  setPage = () => {},
  files = [],
  setFiles = () => {},
  setSummary=()=>{},
  setFilename=()=>{}
}) {
  return (
    <Grid conatiner  justifyItems={"center"} alignItems={"center"}  style={{ height: '100vh' }} >
      <Grid item md={12} lg={12} xl={12} sm={12} >
        <FileUploader setPage={setPage} setSummary={setSummary} setFilename={setFilename} />
      </Grid>
    </Grid>
  );
}
