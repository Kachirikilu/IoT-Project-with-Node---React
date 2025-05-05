const PORT = 5000
import express from "express"
import cors from "cors"
import { createServer } from "http"
import { Server } from "socket.io"
import DeviceRoute from "./routes/DeviceRoute.js"
import UserRoute from "./routes/UserRoute.js"
import MqttRoute from "./routes/MqttRoute.js"
import path from "path"
import fs from "fs"
import fileUpload from "express-fileupload"

import db from "./config/database.js"
import session from "express-session"
import SequelizeStore from "connect-session-sequelize"
import { Sequelize } from "sequelize"

const app = express()
const httpServer = createServer(app)
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
})

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

new Sequelize("sessions", "user", "password", {
  host: "localhost",
  dialect: "mysql",
})

const SessionStore = SequelizeStore(session.Store)
const store = new SessionStore({ db })


app.use(
  session({
    secret: "rahasia123",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: false, // Set true jika pakai HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    },
  })
)

store.sync()

const uploadDir = path.join(path.resolve(), "public/pictures")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 }
  })
)
// Middleware untuk menangani file upload
app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: "No files were uploaded." })
  }
  const file = req.files.file
  const uploadPath = path.join(uploadDir, file.name)
  file.mv(uploadPath, (err) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ msg: "File upload failed." })
    }
    res.status(200).json({ filename: file.name })
  })
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(DeviceRoute)
app.use(UserRoute)
app.use(MqttRoute)
app.use("/public", express.static(path.join(path.resolve(), "public")))

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
  })
})

httpServer.listen(PORT, () =>
  console.log("Server berjalan di PORT " + PORT + "...")
)