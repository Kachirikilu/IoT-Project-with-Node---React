import express from "express"
import { getAllMqttData, getMqttData } from "../controllers/MqttController.js"

const router = express.Router()

router.get("/api/mqtt-data", getAllMqttData)
router.get("/api/mqtt-data/:id", getMqttData)

export default router
