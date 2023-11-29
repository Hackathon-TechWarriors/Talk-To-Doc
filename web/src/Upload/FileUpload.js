
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import socket from "../Socket/Socket"
import axios from 'axios';
import pdficon from "../../src/assets/pdf_logo.png";


export default function FileUploader({setPage=()=>{},setSummary=()=>{},setFilename=()=>{}}) {
 

    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const[progress,setProgress]=useState(0);

    useEffect(()=>{
        socket.on('upload_progress', function(res) {
            setProgress(res?.data);
        });
    },[])
    
    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };
    

    const onTemplateUpload = (e) => {
       
        socket.on('SummarizeResponse', function(res) {
            console.log("summary",res?.data)
            setSummary(res?.data);
            setPage(1);
        });
        let _totalSize = 0;
        const formData = new FormData();
        e.files.forEach((file) => {
            setFilename(file?.name);
            formData.append('file', file);
            axios.post('http://127.0.0.1:5000/Upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
                .then(function (response) {
                  toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
                })
                .catch(function (error) {
                  console.log(error);
                });
            _totalSize += file.size || 0;
        });
        
        setTotalSize(_totalSize);

    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';
        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 20 MB</span>
                    <ProgressBar value={(value/2048)*100} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        setFilename(file?.name)
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={pdficon} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop File Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <div style={{padding:20}} >
            <Toast ref={toast}></Toast>
            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
            <FileUpload  ref={fileUploadRef} name="file"  accept="application/pdf" maxFileSize={100000000}
                onUpload={(e)=>{
                onTemplateUpload(e)}} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} style={{height:'100%'}} uploadHandler={(event)=>
                {

                    onTemplateUpload(event);
                }
                } customUpload  progressBarTemplate={()=> <ProgressBar value={progress} color='#22C55E' style={{ height: '6px' }} showValue={false} ></ProgressBar>}  />
        </div>
    )
}
        