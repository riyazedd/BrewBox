import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
   cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const upload = multer({ storage });

router.post('/', upload.array('images', 5), (req, res) => {
    // 'images' is the field name, 5 is the max number of files
    const imagePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
    res.send({
        message: 'Images uploaded successfully',
        images: imagePaths,
    });
});

export default router;