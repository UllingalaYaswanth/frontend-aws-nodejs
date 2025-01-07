// const mongoose = require('mongoose');

// const fileSchema = new mongoose.Schema({
//   fileName: {
//     type: String,
//     required: true,
//   },
//   filePath: {
//     type: String,
//     required: true,
//   },
// });

// const File = mongoose.model('File', fileSchema);

// module.exports = File;

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  folderName: { type: String, required: true },  // Store the folder name
  files: [{  // Array of file objects
    fileName: { type: String, required: true },  // Original file name
    filePath: { type: String, required: true },  // S3 URL
  }],
});

module.exports = mongoose.model('File', fileSchema);
