const express = require( 'express')
const cors = require( 'cors')
const dotenv = require( 'dotenv')
const mongoose = require( 'mongoose')

const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())

app.listen(process.env.PORT || 8000, () => console.log(`Hello world app listening on port ${process.env.PORT || 8000}!`))

// Connect to DB
app.use('/user', require('./routers/userRouter'))
app.get('/', async (req, res) => { res.send('Hello World!') })
