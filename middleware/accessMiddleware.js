const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const User = require('../models/User')

module.exports = async function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: "You don't have access" })
    }
    const decodedData = jwt.verify(token, secret)
    const user = await User.findOne({ _id: decodedData.id })
    if (!user?._id) {
      return res.status(404).json({ message: 'User  was deleted' })
    }
    if (user.status === 'Blocked') {
      return res.status(404).json({ message: 'User  was blocked' })
    }
    req.user = decodedData
    next()
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: 'Server error' })
  }
}
