import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
export const signup = async (req,res) => {
    const { name, email, password } = req.body
    if(!name || !email || !password) return res.status(400).json({error:"All fields are required !"})
    try{
      // hash password
      const user = await User.findOne({email})
      if(user) return res.status(400).json({error:"Email already exists"})
      if(password.length < 8) res.send('password must be at least 8 characters long')
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = new User({ name, email, password: hash })
      if (newUser){
        generateToken(newUser._id,res)
        res.status(201).json({user_id:newUser._id,
                fullName:newUser.name,
                email:newUser.email,
                profilePic:newUser.profilePic
        })
        await newUser.save()
      }else{
        res.status(400).json({error:"Invalid User Data"})
      }
      // create user    
    }catch(error){
        res.status(400).json({error:"Internal Server Error "})
        console.log(error)
    }
}

export const login =async (req,res) => {
    const {email,password} = req.body
    try{
      const user = await  User.findOne({email})
      if(!user) return res.status(400).json({error:"Invalid Crendentials"})
      const isMatch = await bcrypt.compare(password,user.password)
      if(!isMatch) return res.status(400).json({error:"Invalid Credentials"})
      generateToken(user._id,res)
      res.status(200).json({user_id:user._id,
        fullName:user.name,
        email:user.email,
        profilePic:user.profilePic
    })
    }catch(error){
        res.status(400).json({error:"Internal Server Error "})
        console.log(error)
    }
}

export const logout =(req,res) => {
    try{
      res.cookie('token','',{maxAge:0})
      res.status(200).json({message:"Logged Out Successfully"})
    }catch(error){
        res.status(400).json({error:"Internal Server Error "})
        console.log(error)
    }
}

export const update = async (req,res)=>{
  const {profilePic} = req.body
  const id = req._id

  try{
    if(!profilePic) return res.status(400).json({message:"Profile Pic is required!"})
    
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = User.findByIdAndUpdate(id,{profilePic:uploadResponse.secure_url},{new:true})
    res.status(200).json({message:'User Updated'})
  }catch(error){
    res.status(500).json({error:"Internal Server Error"})
    console.log("Error in update function",error)
  }
}

export const checkAuthUser = async  (req,res) => {
  try{
    res.status(200).json(req.user)
  }catch(error){
    res.status(500).json({error:"Internal Server Error"})
    console.log("Error in checkAuthUser function",error)
  }
}