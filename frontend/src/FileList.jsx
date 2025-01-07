// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const FileList = () => {
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/files');
//         setFiles(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchFiles();
//   }, []);

//   return (
//     <div>
//       <h2>Uploaded Files</h2>
//       <ul>
//         {files.map((file) => (
//           <li key={file._id}>
//             <a href={file.filePath} target="_blank" rel="noopener noreferrer">
//               {file.fileName}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default FileList;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/files');
        setFiles(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <a href={file.filePath} target="_blank" rel="noopener noreferrer">
              {file.fileName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
