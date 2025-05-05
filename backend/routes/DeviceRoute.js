import express from "express";
import {
  getDevices,
  getDeviceById,
  createDevice,
  editDevice,
  deleteDevice,
  // getCacheData
} from "../controllers/DeviceController.js";

const router = express.Router();

// Routes
router.get("/devices", getDevices);
router.get("/devices/:id", getDeviceById);
router.post("/devices", createDevice);
router.put("/devices/:id", editDevice);
router.delete("/devices/:id", deleteDevice);

export default router;
