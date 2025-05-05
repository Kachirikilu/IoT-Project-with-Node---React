import express from "express";
import {
    getDevices,
    getDeviceBySlug,
    createDevice,
    updateDevice,
    deleteDevice
} from "../controllers/DeviceController.js";
import multer from "multer";
import path from 'path';
const router = express.Router();

// import { upload } from '../middlewares/multerConfig.js';
// import { upload } from '../middlewares/upload.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(path.resolve(), 'public/pictures')); // Lokasi penyimpanan file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
    },
});
const upload = multer({storage: storage});
// router.post('/devices', upload.single('picture'), createDevice);
router.post('/devices', createDevice);




router.get('/devices', getDevices);
router.get('/devices/:slug', getDeviceBySlug);
// router.post('/devices', upload.single('picture'), createDevice);

// router.post('/devices', (req, res, next) => {
//     upload.single('picture')(req, res, (err) => {
//         if (err instanceof multer.MulterError) {
//             // Error dari multer (misalnya ukuran file terlalu besar)
//             return res.status(400).json({ msg: err.message });
//         } else if (err) {
//             // Error lainnya (misalnya tipe file tidak valid)
//             return res.status(400).json({ msg: err.message });
//         }
//         next();
//     });
// }, createDevice);


router.put('/devices/:slug', upload.single('picture'), updateDevice);
router.delete('/devices/:slug', deleteDevice);

export default router;