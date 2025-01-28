import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req,res,next) => {
    const token = req.cookies.token
    try{
        if(!token) return res.status(401).json({error:"Unauthorized"})
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        if(!decodedToken) return res.status(401).json({error:"Unothorized"})
        const user = await User.findById(decodedToken.user_id).select('-password')
        req.user = user
        next()
    }catch(error){
        res.status(400).json({error:"Internal Server Error "})
        console.log(error)
    }
}