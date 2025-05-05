import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import DeviceRoute from "./routes/DeviceRoute.js";
import path from "path";
import fs from "fs";
import fileUpload from "express-fileupload";
// import mqttSubs from "./client/subcriber.js";
// import clientSubs from "./client/subcriber.js";


import mqtt from 'mqtt';
const port = 3000;

// import redis from "redis";
// const redisClient = redis.createClient();




const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

var options = {
  host: '126c86adb43647499d16e3385091d404.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'wildan12',
  password: '12NoV2004@'
};


// Buat folder 'public/uploads' jika belum ada
const uploadDir = path.join(path.resolve(), "public/pictures");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware untuk file upload
app.use(
  fileUpload({
    createParentPath: true, // Buat folder jika belum ada
    limits: { fileSize: 10 * 1024 * 1024 }, // Batas ukuran file 10MB
  })
);

// Middleware untuk menangani file upload
app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: "No files were uploaded." });
  }

  const file = req.files.file;
  const uploadPath = path.join(uploadDir, file.name);

  file.mv(uploadPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "File upload failed." });
    }

    res.status(200).json({ filename: file.name });
  });
});

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(DeviceRoute);
// app.use(mqttSubs);
app.use("/public", express.static(path.join(path.resolve(), "public")));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(5000, () => console.log("Server berjalan di port 5000..."));


// PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS
// PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS
// PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS PEMBATAS





var options = {
  host: '126c86adb43647499d16e3385091d404.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'wildan12',
  password: '12NoV2004@'
};

var client = mqtt.connect(options);
let latestMessage = {}; // Variabel untuk menyimpan pesan terbaru

client.on('connect', function () {
  console.log('Connected to MQTT broker');

  client.subscribe('iot/PlantCare', function (err) {
      if (!err) {
          console.log('Subscribed to topic: iot/PlantCare');
      } else {
          console.error('Failed to subscribe to topic:', err);
      }
  });
});

client.on('message', function (topic, message) {
  console.log(`Raw message received:`, message.toString());
  try {
      latestMessage = JSON.parse(message.toString()); // Simpan dalam bentuk JSON
      console.log(`Received message from "${topic}":`, latestMessage);
  } catch (error) {
      console.error('Invalid JSON format:', message.toString());
  }
});

// API endpoint untuk mengakses data MQTT dalam JSON
app.get('/api/mqtt-data', (req, res) => {
  res.json({
      status: 200,
      topic: 'iot/PlantCare',
      data: latestMessage || { error: 'No data received yet' },
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});










// app.get('/api/data', async (req, res) => {
//   const cachedData = await getAsync(message.toString());
//   if (cachedData) {
//     // Return cached data
//     return res.json(JSON.parse(cachedData));
//   }

//   // Fetch data from the database or external API
//   const newData = fetchData();

//   // Cache the data in Redis for future use
//   client.set('cachedData', JSON.stringify(newData), 'EX', 600); // Cache for 10 minutes

//   res.json(newData);
// });

// const getAsync = (key) => {
//   return new Promise((resolve, reject) => {
//     client.get(key, (err, reply) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(reply);
//       }
//     });
//   });
// };

// const fetchData = () => {
//   // Implement your logic to fetch data
// };

