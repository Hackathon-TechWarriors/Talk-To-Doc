import React, { useRef } from 'react';
import "./Header.css"
import { Logo } from '../../../Appbar/Logo';

const PDFHeader = ({label=""}) => {
  const componentRef = useRef();
  return (
    <div>
      <div ref={componentRef}>
        <div className="header">
          <div className="logo">
             <Logo/>
          </div>
          <div className="label">{label.split(".")[0]??""}</div>
        </div>
      </div>
    </div>
  );
};

export default PDFHeader;
