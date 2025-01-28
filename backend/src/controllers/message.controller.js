import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
export const getUsers = async (req,res) =>{
    try{
        const loggedUser = req.user;
        const users = await User.find({ _id: { $ne: loggedUser._id } }).select('-password');
        return res.status(200).json(users);
    }catch(error){
        res.status(500).json({error:"Internal Server Error"})
        console.log("Error in getUsers from message controller function: ",error)
    }
}

export const  getMessages = async (req,res) => {
    try{
        const {id} = req.params
        const me = req.user._id
        const messages = await Message.find({$or:[{senderId:me,receiverId:id},{senderId:id,receiverId:me}]})
        return res.status(200).json(messages)
    }catch(error){
        res.status(500).json({error:"Internal Server Error"})
        console.log("Error in getMessages from message controller function: ",error)
    }
}

export const sendMessages = async (req,res) => {
    try{
        const receiverId = req.params.id
        const me = req.user._id

        const {text,image} = req.body
        if(!text && !image) return res.status(400).json({error:"Text or Image is required"})
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl =  uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId:me,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save()
        // todo - realtime functionality => socket.io
        return res.status(200).json(newMessage)
    }catch(error){
        res.status(500).json({error:"Internal Server Error"})
        console.log("Error in sendMessages from message controller function: ",error)
    }
}