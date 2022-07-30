const User = require('./models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('./config')

const generateAccessToken = (id, email) => {
  console.log(id)
  return jwt.sign({ id, email }, secret, { expiresIn: '24h' })
}

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors })
      }
      const { username, email, password } = req.body
      const candidate = await User.findOne({ email })
      if (candidate) {
        return res
          .status(400)
          .json({ message: 'User with this email already exists' })
      }
      const hashPassword = bcrypt.hashSync(password, 7)
      const user = new User({
        username,
        email,
        password: hashPassword,
        lastActivity: new Date().toString(),
      })
      await user.save()
      const token = generateAccessToken(user._id, user.email)
      return res.json({ token })
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: 'Registration error' })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).json({ message: `User ${email} not found` })
      }
      console.log(user)
      if (user.status === 'Blocked') {
        return res.status(403).json({ message: `User was blocked` })
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(401).json({ message: `Password is invalid` })
      }
      user.lastActivity = new Date().toString()
      await user.save()
      const token = generateAccessToken(user._id, user.email)
      return res.json({ token })
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: 'Login error' })
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find()
      res.json(users)
    } catch (e) {
      console.log(e)
    }
  }

  async deleteUsers(req, res) {
    try {
      const user = await User.deleteMany({ _id: `${req.params.id}` })
      console.log(user)
      res.status(200).send(user)
    } catch (e) {
      console.log(e)
    }
  }

  async blockUsers(req, res) {
    try {
      const user = await User.updateMany(
        { _id: `${req.params.id}` },
        { status: 'Blocked' }
      )
      res.status(200).send(user)
    } catch (e) {
      console.log(e)
    }
  }

  async unblockUsers(req, res) {
    try {
      const user = await User.updateMany(
        { _id: `${req.params.id}` },
        { status: 'Active' }
      )
      res.status(200).send(user)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new authController()
