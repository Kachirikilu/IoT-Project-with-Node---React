import express from "express";
import FileUpload from "express-fileupload";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import DeviceRoute from "./routes/DeviceRoute.js";
import path from "path";
import multer from "multer";



const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/pictures");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if(file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   }
//   else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("picture"));



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(FileUpload());
app.use(DeviceRoute);
app.use('/public', express.static(path.join(path.resolve(), 'public')));


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


httpServer.listen(5000, () => console.log("Server berjalan di port 5000..."));
