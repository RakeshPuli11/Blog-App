import User from "../model/User.js";
import bcrypt from 'bcryptjs';

export const getAllUsers = async(req,res,next)=>{
    let users;
    try {
        users = await User.find();
    } catch (error) {
        return next(error);
    }
    if(!users){
        return res.status(404).json({message:"No user found"})
    }
    return res.status(200).json({users});
}

export const signUp = async(req,res,next)=>{
    const {user,email,password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    }
    catch(err){
        console.log(err);
    }
    if(existingUser){ 
        return res.status(409).json({message:'Email already in use'});
    }
    const hashedPassword = bcrypt.hashSync(password);
    const newUser = new User({
        user,
        email,
        password:hashedPassword,
        blogs:[],
    });
    
    try{
       await newUser.save()
    }catch(err){
        console.log(err);
    }
    return res.status(200).json({newUser});
}


export const login = async(req,res,next)=>{
    const {email,password}=req.body;
    let existingUser
    try{
     existingUser = await User.findOne({email});
    }catch(err){
        console.log(err);
    }
    if(!existingUser){
        return res.status(404).json({message:"Email not found"});
    }
    const checkPass = bcrypt.compareSync(password,existingUser.password);
    if(!checkPass){
        return res.status(404).json({message:"Password is incorrect"});
    }
    return res.status(200).json({message:"login sucessful !"});
}


export const getUserById = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving user" });
    }
};
