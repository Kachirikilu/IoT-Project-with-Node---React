import UserModel from "../models/UserModel.js"
import { io } from "../index.js"
import bcrypt from "bcrypt"



export const getUsers = async (req, res) => {
  try {
    const response = await UserModel.findAll()
    res.status(200).json(response)
  } catch (error) {
    console.log(error.message)
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: {
        id: req.params.id,
      },
    })
    if (!user) {
      res.status(404).json({ msg: "User tidak ditemukan!" })
    } else {
      res.status(200).json(device)
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: "Server error" })
  }
}

export const registerUser = async (req, res) => {
  try {
    console.log("req.body:", req.body)
    console.log("req.files:", req.files)

    const { username, email, password, confirmPassword } = req.body

    const errors = {}

    if (!username) {
        errors.username = "Username harus diisi!"
    }
    if (!email) {
      errors.email = "Email harus diisi!"
    }

    const existingUser = await UserModel.findOne({where: {username}})
    const existingEmail = await UserModel.findOne({where: {email}
    })

    if (existingUser) {
      errors.username = "Username sudah digunakan!"
    } 
    if (existingEmail) {
      errors.email = "Email sudah digunakan!"
    } 

    if (!password) {
      errors.password = "Password harus diisi!"
    } else {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
      if (!passwordRegex.test(password)) {
        errors.password = "Password minimal 8 karakter, harus mengandung huruf dan angka!"
      }
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Konfirmasi password harus diisi!"
    } else {
      if (password !== confirmPassword) {
        errors.confirmPassword = "Konfirmasi password tidak cocok!"
      }
    }
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors)
    }
    
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const userData = await UserModel.create({
      username,
      email,
      password: hashedPassword
    })

    io.emit("userUpdate", userData)

    res.status(201).json({
      msg: "User berhasil dibuat!",
      user: userData,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: "Server error" })
  }
}


export const loginUser = async (req, res) => {
  try {
      const { username, password } = req.body

      const errors = {}
      let user = null

      if (!username) {
        errors.username = "Username atau email harus diisi!"
      } else {
        user = await UserModel.findOne({where: {username}})
        console.log("User ditemukan:", user)
        if (!user) {
          user = await UserModel.findOne({where: {email:username}})
          console.log("User ditemukan:", user)
        }
      }
      
      if (!password) {
        errors.password = "Password harus diisi!"
      }
      
      if (!user && username) {
          errors.username = "User tidak ditemukan!"
      } else {
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            errors.password = "Password salah!"
        }
      }
          
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors)
      } else {
        if (!req.session) {
          return res.status(500).json({ msg: "Session tidak tersedia!" })
        }

        req.session.userId = user.id
        res.status(200).json({ msg: "Login berhasil", user })
      }
  } catch (error) {
      console.log(error.message)
      res.status(500).json({ msg: "Server error" })
  }
}


export const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ msg: "Logout gagal" });

    res.clearCookie("connect.sid");
    return res.json({ msg: "Logout berhasil" });
  });
};

export const sessionUser = async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(200).json({ isLoggedIn: false, msg: "Belum login" })
  }

  try {
    const user = await UserModel.findOne({
      where: { id: req.session.userId },
      attributes: ["id", "username", "email"],
    })

    if (!user) {
      return res.status(404).json({ isLoggedIn: false, msg: "User tidak ditemukan" })
    }

    res.status(200).json({ isLoggedIn: true, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ isLoggedIn: false, msg: "Terjadi kesalahan server" })
  }
}


// Pembatas Pembatas Pembatas Pembatas Pembatas Pembatas Pembatas Pembatas




export const editUser = async (req, res) => {
  try {
    const userData = await UserModel.findOne({
      where: { id: req.params.id },
    })

    if (!userData) {
      return res.status(404).json({ msg: "User tidak ditemukan!" })
    }

    const {username, email, password } = req.body

    await userData.update({
      username,
      email,
      password
    })

    io.emit("userUpdate", userData)

    res.status(200).json({
      msg: "User berhasil diubah!",
      user: userData,
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ msg: "Server error" })
  }
}

export const deleteUser = async(req, res) => {
    try {
        const userData = await UserModel.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!userData) {
            res.status(404).json({ msg: "User tidak ditemukan!" })
        } else {
            await userData.destroy({
                where: {
                    id: req.params.id
                }
            })

            io.emit('userDelete', userData.id)
            
            res.status(200).json({
                msg: "User dihapus!"
            })
        }
    } catch(error) {
        console.log(error.message)
    }
}