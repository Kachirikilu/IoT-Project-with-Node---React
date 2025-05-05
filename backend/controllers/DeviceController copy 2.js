import DeviceModel from "../models/DeviceModel.js";
import { io } from "../index.js";
import path from "path";
import fs from "fs";
import mqtt from 'mqtt';

// import express from 'express'
// import apicache from 'apicache'
// import mqttPublish from "../client/publisher.js";
// import mqttSubs from "../client/subcriber.js";

// let app = express()
// let cache = apicache.middleware

// app.use(cache('5 minutes'))

// app.get('/will-be-cached', (req, res) => {
//   res.json({ success: true })
// })

var options = {
    host: '126c86adb43647499d16e3385091d404.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'wildan12',
    password: '12NoV2004@'
};

var client = mqtt.connect(options);

client.on('connect', function () {
  console.log('Connected to MQTT broker');

  client.subscribe('iot/PlantCare', function (err) {
      if (!err) {
          console.log('Subscribed to topic: iot/PlantCare');

          client.publish('iot/PlantCare', 'Hello, this is a test message!', function (err) {
              if (!err) {
                  console.log('Message published to topic: iot/PlantCare');
              } else {
                  console.error('Failed to publish message:', err);
              }
          });
      } else {
          console.error('Failed to subscribe to topic:', err);
      }
  });
});

client.on('error', function (error) {
  console.error('MQTT Error:', error);
});

client.on('message', function (topic, message) {
  console.log(`Received message from topic "${topic}": ${message.toString()}`);
});


export const getCacheData = async (req, res) => {
  try {
    res.render(message.toString());
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: 400, message: "Error getting subscriber page" });
  }
};



export const getDevices = async (req, res) => {
  try {
    const response = await DeviceModel.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getDeviceById = async (req, res) => {
  try {
    const device = await DeviceModel.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!device) {
      res.status(404).json({ msg: "Device tidak ditemukan!" });
    } else {
      res.status(200).json(device);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const createDevice = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const { device, information } = req.body;

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    const milisecond = String(date.getMilliseconds()).padStart(3, "0");
    const dateNew = `${year}${month}${day}${second}${milisecond}`;

    if (!device || !information) {
      return res.status(400).json({ msg: "Device dan Information harus diisi!" });
    }

    let pictureName = "No Image.jpg";
    if (req.files && req.files.file) {
      const file = req.files.file;

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ msg: "Hanya file gambar (JPEG, PNG, GIF) yang diperbolehkan." });
      }



      const fileExtension = path.extname(file.name);
      pictureName = 'KyuXd_' + dateNew + "_" + Math.round(Math.random() * 1E9) + fileExtension;
      const uploadPath = path.join("public/pictures", pictureName);



      try {
        await file.mv(uploadPath);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "File upload failed." });
      }
    }

    const deviceData = await DeviceModel.create({
      device,
      information,
      picture: pictureName,
    });

    const slug = `${deviceData.id}_${device}_${dateNew}`;

    await deviceData.update({ slug });
    io.emit("deviceUpdate", deviceData);

    res.status(201).json({
      msg: "Device berhasil dibuat!",
      device: deviceData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const editDevice = async (req, res) => {
  try {
    const deviceData = await DeviceModel.findOne({
      where: { id: req.params.id },
    });

    if (!deviceData) {
      return res.status(404).json({ msg: "Device tidak ditemukan!" });
    }

    const { device, information } = req.body;

    let pictureName = deviceData.picture;
    if (req.files && req.files.file) {
      const file = req.files.file;

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ msg: "Hanya file gambar (JPEG, PNG, GIF) yang diperbolehkan." });
      }

      if (pictureName && pictureName !== "No Image.jpg") {
        const oldFilePath = path.join("public/pictures", pictureName);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const second = String(date.getSeconds()).padStart(2, "0");
      const milisecond = String(date.getMilliseconds()).padStart(3, "0");
      const dateNew = `${year}${month}${day}${second}${milisecond}`;

      const fileExtension = path.extname(file.name);
      pictureName = 'KyuXd_' + dateNew + "_" + Math.round(Math.random() * 1E9) + fileExtension;
      const uploadPath = path.join("public/pictures", pictureName);

      await file.mv(uploadPath);
    }

    const oldSlug = deviceData.slug.slice(-13);

    // const date = new Date();
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, "0");
    // const day = String(date.getDate()).padStart(2, "0");
    // const second = String(date.getSeconds()).padStart(2, "0");
    // const milisecond = String(date.getMilliseconds()).padStart(3, "0");
    // const slug = `${deviceData.id}_${device}_${year}${month}${day}${second}${milisecond}`;
    const slug = `${deviceData.id}_${device}_${oldSlug}`;

    await deviceData.update({
      slug,
      device,
      information,
      picture: pictureName,
    });

    io.emit("deviceUpdate", deviceData);

    res.status(200).json({
      msg: "Device berhasil diubah!",
      device: deviceData,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteDevice = async(req, res) => {
    try {
        const deviceData = await DeviceModel.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!deviceData) {
            res.status(404).json({ msg: "Device tidak ditemukan!" });
        } else {
            await deviceData.destroy({
                where: {
                    id: req.params.id
                }
            });

            let pictureName = deviceData.picture;
            if (pictureName && pictureName !== "No Image.jpg") {
                const oldFilePath = path.join("public/pictures", pictureName);
                if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
                }
            }


            io.emit('deviceDelete', deviceData.id);
            
            res.status(200).json({
                msg: "Device dihapus!"
            });
        }
    } catch(error) {
        console.log(error.message);
    }
}


