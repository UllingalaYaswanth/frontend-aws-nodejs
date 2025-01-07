// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const uploadFile = async () => {
//     if (!file) {
//       setMessage('No file selected');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('http://localhost:3000/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setMessage('File uploaded successfully');
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//       setMessage('Error uploading file');
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       <button onClick={uploadFile}>Upload</button>
//       <p>{message}</p>
//     </div>
//   );
// };

// export default FileUpload;


import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [fileName, setFileName] = useState('');
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  // Handles file selection
  const onFileChange = (e, index) => {
    const updatedFiles = [...files];
    updatedFiles[index] = e.target.files[0];  // Update the file at index
    setFiles(updatedFiles);
  };

  // Handles file name input
  const onFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const uploadFiles = async () => {
    if (!fileName || files.length < 4) {
      setMessage('Please provide a file name and upload all 4 files');
      return;
    }

    const formData = new FormData();
    formData.append('fileName', fileName);  // Include the file name
    files.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);  // Append each file to FormData
    });

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Files uploaded successfully');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage('Error uploading files');
    }
  };

  return (
    <div>
      <input type="text" placeholder="File name" value={fileName} onChange={onFileNameChange} />
      <input type="file" onChange={(e) => onFileChange(e, 0)} />
      <input type="file" onChange={(e) => onFileChange(e, 1)} />
      <input type="file" onChange={(e) => onFileChange(e, 2)} />
      <input type="file" onChange={(e) => onFileChange(e, 3)} />
      <button onClick={uploadFiles}>Upload</button>
      <p>{message}</p>
    </div>
  );
};

export default FileUpload;
