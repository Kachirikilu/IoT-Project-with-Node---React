import multer from 'multer';
import path from 'path';
// import fs from 'fs';

// const uploadDir = path.join(path.resolve(), 'public/pictures');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/pictures'); // Lokasi penyimpanan file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// export const upload = multer({
//     storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal ukuran file 10 MB
// });

// Validasi tipe file
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.includes(ext)) {
        return cb(new Error('File type not allowed. Only PNG, JPG, JPEG, and GIF are allowed.'));
    }
    cb(null, true);
};

// Middleware multer
export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal ukuran file 10 MB
    fileFilter,
});


// export const upload = multer({ storage });

// const express = require('express')
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

// app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
//   res.send('Successfully uploaded ' + req.files.length + ' files!')
// })

// const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
// app.post('/cool-profile', cpUpload, function (req, res, next) {

// })