// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const fileUpload = require('multer');
// const multerS3 = require('multer-s3'); // Import multer-s3
// const { S3Client } = require('@aws-sdk/client-s3');
// const File = require('./models/File'); // MongoDB model to store file paths

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // AWS S3 Configuration using AWS SDK v3
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // File Upload Setup using multer-s3 to AWS S3
// const upload = fileUpload({
//   storage: multerS3({
//     s3: s3Client, // Pass AWS S3 client here
//     bucket: process.env.AWS_BUCKET_NAME,
//     // acl: 'public-read', // Ensure the file is publicly accessible
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `uploads/${Date.now()}_${file.originalname}`); // File naming convention
//     },
//   }),
// });

// // MongoDB setup
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log(err));

// // File upload route
// app.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const file = req.file; // This will be the file uploaded to S3
//     const fileData = new File({
//       fileName: file.originalname,
//       filePath: file.location, // This will be the S3 URL of the uploaded file
//     });
//     await fileData.save(); // Save the file info to MongoDB
//     res.json({ message: 'File uploaded successfully', file: fileData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error uploading file', error });
//   }
// });

// // Get all uploaded files route
// app.get('/files', async (req, res) => {
//   try {
//     const files = await File.find();
//     res.json(files);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching files', error });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const File = require('./models/File'); // MongoDB model to store file paths

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AWS S3 Configuration using AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// File Upload Setup using multer-s3 to AWS S3
const upload = fileUpload({
  storage: multerS3({
    s3: s3Client, // Pass AWS S3 client here
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = req.body.fileName; // Use the fileName from the form data
      cb(null, `uploads/${fileName}/${Date.now()}_${file.originalname}`); // File saved under the fileName folder
    },
  }),
});

// MongoDB setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// File upload route
app.post('/upload', upload.fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'file3', maxCount: 1 },
  { name: 'file4', maxCount: 1 }
]), async (req, res) => {
  try {
    const fileData = [];

    // Loop through uploaded files and store them
    ['file1', 'file2', 'file3', 'file4'].forEach(field => {
      if (req.files[field]) {
        req.files[field].forEach(file => {
          // Store file metadata in the fileData array
          fileData.push({
            fileName: file.originalname,
            filePath: file.location, // S3 URL of the uploaded file
          });
        });
      }
    });

    // Find the document by folderName (fileName) or create a new one if it doesn't exist
    let folderDoc = await File.findOne({ folderName: req.body.fileName });

    if (!folderDoc) {
      // If the folder doesn't exist, create a new document
      folderDoc = new File({
        folderName: req.body.fileName,
        files: fileData,
      });
      await folderDoc.save(); // Save to MongoDB
    } else {
      // If the folder exists, add the new files to the existing folder
      folderDoc.files = [...folderDoc.files, ...fileData];
      await folderDoc.save(); // Save updated document
    }

    res.json({ message: 'Files uploaded successfully', folder: folderDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading files', error });
  }
});

// Get all uploaded files route
app.get('/files', async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching files', error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
