import React from "react";
import { Menubar } from "primereact/menubar";
import { Grow, Tooltip, Typography } from "@mui/material";
import { Button } from "primereact/button";

export function SummaryView({ summary = [], setVisible = () => {} , filename="" }) {
  return (
    <>
      <Menubar
        start={() => (
          <>
            <Tooltip title="Summary View">
              <i
                data-pr-tooltip="Summary view"
                title="Summary view"
                className="info-icon pi pi-info-circle"
                style={{
                  fontSize: "1.1rem",
                  paddingRight: 8,
                  cursor: "pointer",
                }}
              ></i>
            </Tooltip>
            <Typography style={{ display: "inline" }} variant="h6" gutterBottom>
              {filename}
            </Typography>
          </>
        )}
        style={{
          backgroundColor: "#FFFFFFF2",
          borderRadius: 0,
          position: "sticky",
          top: 0,
          opacity: 0.9,
          borderBottom: 0,
        }}
        end={() => (
          <Tooltip title="Export Summary">
            <Button
              onClick={() => setVisible(true)}
              icon="pi pi-upload"
              outlined
              severity="secondary"
              aria-label="Bookmark"
            />
          </Tooltip>
        )}
      />
      <ul style={{ margin: 10 }}>
        {summary?.map((exp) => (
          <Grow in={true}>
            <li>
              <span>
                <i className="pi pi-check-circle"></i>
              </span>
              {exp}
            </li>
          </Grow>
        ))}
      </ul>
    </>
  );
}
