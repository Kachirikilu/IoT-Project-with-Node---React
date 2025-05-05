import DeviceModel from "../models/DeviceModel.js";
import { io } from "../index.js";
import multer from 'multer';
import path from "path";

export const getDevices = async(req, res) => {
    try {
        const response = await DeviceModel.findAll();
        res.status(200).json(response);
    } catch(error) {
        console.log(error.message);
    }
}

export const getDeviceBySlug = async(req, res) => {
    try {
        const device = await DeviceModel.findOne({
            where: {
                slug: req.params.slug
            }
        });
        if (!device) {
            res.status(404).json({ msg: "Device tidak ditemukan!" });
        } else {
            res.status(200).json(device);
        }
    } catch(error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server error" });
    }
}


// export const createDevice = async(req, res) => {
//     try {
//         const device = await DeviceModel.create(req.body);

//         const date = new Date();
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const second = String(date.getSeconds()).padStart(2, '0');
//         const milisecond = String(date.getMilliseconds()).padStart(3, '0');
//         const slug = `${device.id}_${req.body.device}_${year}${month}${day}${second}${milisecond}`;
        
//         await device.update({
//             slug
//         });

//         io.emit('deviceUpdate', device);

//         res.status(201).json({
//             msg: "Device tersimpan!"
//         });
//     } catch(error) {
//       console.log(error.message);
//     }
// }

export const createDevice = async (req, res) => {
  
    // const { device, information } = req.body;

    try {
        const pictureName = req.file ? req.file.filename : "No Image.jpg";
        const deviceData = await DeviceModel.create({
            device: req.body.device,
            information: req.body.information,
            picture: pictureName
        });
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        const milisecond = String(date.getMilliseconds()).padStart(3, '0');
        const slug = `${deviceData.id}_${deviceData.device}_${year}${month}${day}${second}${milisecond}`;
        await deviceData.update({ slug });
        io.emit('deviceUpdate', deviceData);
        res.status(201).json({
            msg: 'Device saved!',
            device: deviceData,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};


// export const createDevice = async (req, res) => {
    
//     let pictureName;
//     if (!req.file) {
//         // return res.status(400).json({ msg: 'No file uploaded' });
//         const err = new Error('No file uploaded');;
        
//         pictureName = "No Image.jpg";
//     } else {
//         const ext = path.extname(req.file.originalname).toLowerCase(); // Ekstensi file
//         pictureName = file.md5 + ext;
//         // const picture = req.file.picture;
//         // const pictureSize = file.data.lenght;
//         // const ext = path.extname(picture.name);

//         const allowedType = ['.png', '.jpg', '.jpeg', '.gif'];
//         if (!allowedType.includes(ext.toLocaleLowerCase())) {
//             return res.status(400).json({ msg: 'File type not allowed' });
//         }
//         // if (pictureSize > 10 * 1024 * 1024) {
//         //     return res.status(400).json({ msg: 'File size too large' });
//         // }
//         if (req.file.size > 10 * 1024 * 1024) { // Maksimal 10 MB
//             return res.status(400).json({ msg: 'File size too large' });
//         }
//         // file.mw(`./public/pictures/${pictureName}`, async(err) => {
//         //     if (err) {
//         //         console.error(err);
//         //         return res.status(500).json({ msg: 'Server error' });
//         //     }
//         // });
//     }
//     // const device = req.body.device;
//     // const information = req.body.information;
//     const { device, information } = req.body;

//     try {
//         const deviceData = await DeviceModel.create({
//             device,
//             information,
//             picture: pictureName
//         });
//         const date = new Date();
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const second = String(date.getSeconds()).padStart(2, '0');
//         const milisecond = String(date.getMilliseconds()).padStart(3, '0');
//         const slug = `${deviceData.id}_${device}_${year}${month}${day}${second}${milisecond}`;
//         await deviceData.update({ slug });
//         io.emit('deviceUpdate', deviceData);
//         res.status(201).json({
//             msg: 'Device saved!',
//             device: deviceData,
//         });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ msg: 'Server error' });
//     }
// };



// export const createDevice = async (req, res) => {
//     try {
//         if (!req.body.device || !req.body.information) {
//             return res.status(400).json({ msg: "Device dan Information harus diisi!" });
//         }
//         const { device, information } = req.body;
//         const pictureName = req.file ? req.file.filename : "No Image.jpg";

//         const deviceData = await DeviceModel.create({
//             device,
//             information,
//             picture: pictureName, 
//         });

//         console.log('Body:', req.body);
//         console.log('File:', req.file);

//         const date = new Date();
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const second = String(date.getSeconds()).padStart(2, '0');
//         const milisecond = String(date.getMilliseconds()).padStart(3, '0');
//         const slug = `${deviceData.id}_${device}_${year}${month}${day}${second}${milisecond}`;

//         await deviceData.update({ slug });
//         io.emit('deviceUpdate', deviceData);

//         res.status(201).json({
//             msg: "Device tersimpan!",
//             device: deviceData,
//         });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ msg: 'Server error' });
//     }
// };


export const updateDevice = async (req, res) => {
    try {
        // Cari perangkat berdasarkan slug
        const deviceData = await DeviceModel.findOne({
            where: {
                slug: req.params.slug,
            },
        });

        if (!deviceData) {
            return res.status(404).json({ msg: "Device tidak ditemukan!" });
        }

        // Validasi input
        if (!req.body.device || !req.body.information) {
            return res.status(400).json({ msg: "Device dan Information harus diisi!" });
        }

        // Ambil data dari request
        const { device, information } = req.body;
        const pictureName = req.file ? req.file.filename : deviceData.picture || "No Image.jpg";

        // Buat slug baru menggunakan deviceData.id
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        const milisecond = String(date.getMilliseconds()).padStart(3, '0');
        const slug = `${deviceData.id}_${device}_${year}${month}${day}${second}${milisecond}`;

        // Log untuk debugging
        console.log('Request Body:', req.body);
        console.log('Request File:', req.file);
        console.log('Device Data:', deviceData);
        console.log('Slug:', slug);

        // Perbarui data perangkat
        await deviceData.update({
            slug,
            device,
            information,
            picture: pictureName,
        });

        // Emit event ke socket.io
        io.emit('deviceUpdate', {
            id: deviceData.id,
            slug,
            device,
            information,
            picture: pictureName,
        });

        // Kirim respon sukses
        res.status(200).json({
            msg: "Device berhasil diperbarui!",
            device: deviceData,
        });
    } catch (error) {
        console.error('Error di updateDevice:', error.message);
        res.status(500).json({ msg: "Server error" });
    }
};



// export const updateDevice = async(req, res) => {
//     try {
//         const deviceData = await DeviceModel.findOne({
//             where: {
//                 slug: req.params.slug
//             }
//         });
//         if (!deviceData) {
//             return res.status(404).json({ msg: "Device tidak ditemukan!" });
//         }

//             // if (!req.body.device || !req.body.information) {
//             //     return res.status(400).json({ msg: "Device dan Information harus diisi!" });
//             // }
//             const { device, information } = req.body;
//             const pictureName = req.file ? req.file.filename : deviceData.picture || "No Image.jpg";
    
//             // const deviceData = await DeviceModel.update({
//             //     device,
//             //     information,
//             //     picture: pictureName, 
//             // });
//             if (!device || !information) {
//                 return res.status(400).json({ msg: "Device dan Information harus diisi!" });
//             }
    
//             console.log('Body:', req.body);
//             console.log('File:', req.file);

//             const date = new Date();
//             const year = date.getFullYear();
//             const month = String(date.getMonth() + 1).padStart(2, '0');
//             const day = String(date.getDate()).padStart(2, '0');
//             const second = String(date.getSeconds()).padStart(2, '0');
//             const milisecond = String(date.getMilliseconds()).padStart(3, '0');
//             const slug = `${deviceData.id}_${req.body.device}_${year}${month}${day}${second}${milisecond}`;
            
//             // await device.update({
//             //     ...req.body, slug
//             // });

//             await deviceData.update({ 
//                 slug,
//                 device,
//                 information,
//                 picture: pictureName,
//             });
//             // io.emit('deviceUpdate', deviceData);
//             io.emit('deviceUpdate', {
//                 id: deviceData.id,
//                 slug,
//                 device,
//                 information,
//                 picture: pictureName,
//             });
    
//             res.status(201).json({
//                 msg: "Device tersimpan!",
//                 device: deviceData,
//             });

//             // io.emit('deviceUpdate', device);

//             // res.status(200).json({
//             //     msg: "Device diubah!"
//             // });
        
//     } catch(error) {
//       console.log(error.message);
//       res.status(500).json({ msg: "Server error" });
//     }
// }

// export const updateDevice = async(req, res) => {
//     try {
//         const device = await DeviceModel.findOne({
//             where: {
//                 id: req.params.id
//             }
//         });
//         if (!device) {
//             res.status(404).json({ msg: "Device tidak ditemukan!" });
//         } else {

//             const date = new Date();
//             const year = date.getFullYear();
//             const month = String(date.getMonth() + 1).padStart(2, '0');
//             const day = String(date.getDate()).padStart(2, '0');
//             const second = String(date.getSeconds()).padStart(2, '0');
//             const milisecond = String(date.getMilliseconds()).padStart(3, '0');
//             const slug = `${device.id}_${req.body.device}_${year}${month}${day}${second}${milisecond}`;
            
//             await device.update({
//                 ...req.body, slug
//             });

//              io.emit('deviceUpdate', device);

//             res.status(200).json({
//                 msg: "Device diubah!"
//             });
//         }
//     } catch(error) {
//       console.log(error.message);
//     }
// }

export const deleteDevice = async(req, res) => {
    try {
        const device = await DeviceModel.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!device) {
            res.status(404).json({ msg: "Device tidak ditemukan!" });
        } else {
            await device.destroy({
                where: {
                    id: req.params.id
                }
            });

            io.emit('deviceDelete', device.id);
            
            res.status(200).json({
                msg: "Device dihapus!"
            });
        }
    } catch(error) {
        console.log(error.message);
    }
}


