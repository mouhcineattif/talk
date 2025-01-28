import express from 'express'
import authRoutes from './routes/auth.route.js'
import dotenv from 'dotenv'
import connectDB from './lib/db.js'
import cookieParser from 'cookie-parser'


dotenv.config()
const app = express()
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authRoutes)

app.listen(process.env.PORT, () => {
    console.log('Server is running on port '+process.env.PORT)
    connectDB()
})