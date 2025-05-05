import express from "express"
import {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  logoutUser,
  sessionUser,
  editUser,
  deleteUser,
} from "../controllers/UserController.js"

const router = express.Router()

// Routes
router.get("/users", getUsers)
router.get("/users/:id", getUserById)
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/me", sessionUser);
router.get("/logout", logoutUser)
router.post("/session", sessionUser)
router.put("/edit_user/:id", editUser)
router.delete("/users/:id", deleteUser)

export default router