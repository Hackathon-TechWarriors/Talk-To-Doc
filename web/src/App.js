import "./App.css";
import {  useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "react-chat-elements/dist/main.css";
import 'primeicons/primeicons.css';
import { Chat } from "./Conversation/Chat/Chat";
import { Upload } from "./Upload/Upload";
import { Navbar } from "./Appbar/Navbar";
        


function App() {
  const [page, setPage] = useState(0);
  const [files, setFiles] = useState([]);
  const [summary, setSummary] = useState("");
  const [filename, setFilename] = useState("");

  return (
    <PrimeReactProvider>
      <div className="App">
        <div>
          <Navbar />
        </div>
        <div style={{marginTop:65,position:"fixed",width:"100%"}} >
        {page === 0 ? (
          <Upload
            files={files}
            setFiles={setFiles}
            setPage={setPage}
            setSummary={setSummary}
            setFilename={setFilename}
          />
        ) : (
          <Chat summary={summary} filename={filename} />
        )}
        </div>
      </div>
    </PrimeReactProvider>
  );
}

export default App;
