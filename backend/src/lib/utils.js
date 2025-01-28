import jwt from 'jsonwebtoken' 
export const generateToken = (user_id,res)=>{
    const token = jwt.sign({user_id},process.env.JWT_SECRET,{expiresIn:'15d'})
    res.cookie('token',token,{httpOnly:true,maxAge:15*24*60*60*1000,sameSite:"strict",secure:process.env.NODE_ENV==="production"})
    return token
}