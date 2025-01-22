import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connected : '+conn.connection.host)
    } catch (error) {
        
        console.log(error)
        // return res.json({error})
    }
}
export default connectDB