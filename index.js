const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./router')

const PORT = process.env.PORT || 4000
const app = express()

const corsOptions = {
  origin: 'https://authmernapp-server.herokuapp.com/',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/auth', router)

const start = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://zet6:123@cluster0.do9grus.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    app.listen(PORT, () => {
      console.log(`Server has been started on ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
