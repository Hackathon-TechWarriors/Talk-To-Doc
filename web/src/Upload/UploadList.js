import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";
import FolderIcon from "@mui/icons-material/Folder";

export function UploadList({files=[],setPage=()=>{}}) {
  return (
    <List style={{overflowX:"hidden", width:"90%",overflow:"scroll",marginTop:30,marginRight:20, marginBottom:10,height:`${window.innerHeight-150}px`, maxHeight:`${window.innerHeight-150}px`}}>
      {files?.map((exp,i) => (
        <ListItem key={i} disablePadding onClick={()=>setPage(1)} >
          <ListItemButton>
            <ListItemAvatar>
              <Avatar style={{ background: "86bc25" }}>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={exp?.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
