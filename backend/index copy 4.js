import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import DeviceRoute from "./routes/DeviceRoute.js";
import path from "path";
import fs from "fs";
import fileUpload from "express-fileupload";
// import mqttSubs from "./client/subcriber.js";
import redis from "redis";
const client = redis.createClient();


const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

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
app.use(express.urlencoded({ extended: true }));
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





app.get('/api/data', async (req, res) => {
  const cachedData = await getAsync('cachedData');
  if (cachedData) {
    // Return cached data
    return res.json(JSON.parse(cachedData));
  }

  // Fetch data from the database or external API
  const newData = fetchData();

  // Cache the data in Redis for future use
  client.set('cachedData', JSON.stringify(newData), 'EX', 600); // Cache for 10 minutes

  res.json(newData);
});

const getAsync = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
};

const fetchData = () => {
  // Implement your logic to fetch data
};

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
