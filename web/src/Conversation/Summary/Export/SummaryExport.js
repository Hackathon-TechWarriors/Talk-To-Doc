import React from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Grow } from "@mui/material";
import { Button } from "primereact/button";
import { Margin, usePDF } from "react-to-pdf";
import PDFHeader from "./Header";

export function SummaryExport({
  visible = false,
  setVisible = () => {},
  summary = [],
  filename=""
}) {
    const { toPDF, targetRef } = usePDF({
        filename: filename.split(".pdf").join("_summary.pdf"),
        page: { margin: Margin.MEDIUM }
      });
  return (
    <>
      <Dialog
        header="Export Summary"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={() => <Button label="Download" icon="pi pi-download" onClick={toPDF} />}
      >
        <Card  ref={targetRef} >
          <PDFHeader label={filename} />
          <ul style={{ margin: 10 }} >
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
        </Card>
      </Dialog>
    </>
  );
}
