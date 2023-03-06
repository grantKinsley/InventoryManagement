import React from "react";
import Papa from "papaparse";
import axios from "axios";
const baseURL = "http://localhost:8000/amz_items/";

// function handleFiles(file) {
//   const fileReader = new FileReader();
//   if (file) {
//     fileReader.onload = function (event) {
//       const csvOutput = event.target.result;
//       console.log(csvOutput);
//     };
//   }
// }

// drag drop file component
const Upload = () => {
  // drag state
  // const [dragActive, setDragActive] = React.useState(false);
  const [file, setFile] = React.useState(null);
  // ref
  // const inputRef = React.useRef(null);

  // handle drag events
  // const handleDrag = function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (e.type === "dragenter" || e.type === "dragover") {
  //     setDragActive(true);
  //   } else if (e.type === "dragleave") {
  //     setDragActive(false);
  //   }
  // };

  // triggers when file is dropped
  // const handleDrop = function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragActive(false);
  //   if (e.dataTransfer.files && e.dataTransfer.files[0]) {
  //     handleFiles(e.dataTransfer.files);
  //   }
  // };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      // handleFiles(e.target.files[0]);
      const inputFile = e.target.files[0];
      setFile(inputFile);
    }
  };

  // triggers the input when the button is clicked
  const handleUpload = () => {
    if (!file) {
      window.alert("Enter a valid file");
      return;
    }
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      try {
        // Read CSV using PAPA library
        const csv = Papa.parse(target.result, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
        const parsedData = csv?.data;
        console.log(parsedData);

        // Send JSON to Backend API

        const accessToken = sessionStorage.getItem("serverToken");
        const response = await axios.post(baseURL, JSON.stringify(parsedData), {
          headers: { "Content-Type": "application/json", Bearer: accessToken },
        });
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input onChange={handleChange} type="file" />
      <button onClick={handleUpload}>Upload File</button>
    </div>
    // <form
    //   id="form-file-upload"
    //   onDragEnter={handleDrag}
    //   onSubmit={(e) => e.preventDefault()}
    // >
    //   <input
    //     // ref={inputRef}
    //     type="file"
    //     accept={".csv"}
    //     id="input-file-upload"
    //     multiple={false}
    //     onChange={handleChange}
    //   />
    //   <label
    //     id="label-file-upload"
    //     htmlFor="input-file-upload"
    //     className={dragActive ? "drag-active" : ""}
    //   >
    //     <div>
    //       <p>Drag and drop your file here or</p>
    //       <button className="upload-button" onClick={uploadFile}>
    //         Upload a file
    //       </button>
    //     </div>
    //   </label>
    //   {dragActive && (
    //     <div
    //       id="drag-file-element"
    //       onDragEnter={handleDrag}
    //       onDragLeave={handleDrag}
    //       onDragOver={handleDrag}
    //       onDrop={handleDrop}
    //     ></div>
    //   )}
    // </form>
  );
};

export default Upload;
