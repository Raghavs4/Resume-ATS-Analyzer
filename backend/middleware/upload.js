import multer from 'multer';

const upload = multer({
   storage: multer.memoryStorage(),
   limits:{fileSize: 1024*1024},
   fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF/DOCX allowed"), false);
    }
  },

})

export default upload;