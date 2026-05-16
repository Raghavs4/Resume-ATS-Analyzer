import userModel from "../model/userModel.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import generateToken from "../utils/generateToken.js";


//login
 const loginUser = async (req,res) => {
    try{
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.json({success:false, message:"User does not exist"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.json({success:false, message:"Incorrect Password"});
    }
    const token =  generateToken(user._id);
    res.json({success:true, token});
    }
    catch(error){
        res.json({success:false, message:error.message});
    }
 }

//register
const registerUser = async (req,res) => {
  const {name,email,password} = req.body;
  try{
    //check if already exists
    const exist = await userModel.findOne({email});
   if(exist){
    return res.json({success:false, message:"User already exists"});
   }

   //validation
   if(!validator.isEmail(email)){
    return res.json({success:false, message:"Invalid Email"});
   }
    if(!validator.isStrongPassword(password)){
    return res.json({success:false, message:"Password is not strong enough"});
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new userModel({
    name:name,
    email:email,
    password:hashedPassword,
  })

  const user = await newUser.save();
  const token = generateToken(user._id);
  res.json({success:true,token});
}   
  catch(error){
    res.json({success:false, message:error.message});
  }
   
}

const logoutUser = (req,res) => {
   try{
    
    res.json({success:true, message:"User logged out successfully"});
   }
   catch(error){
    res.json({success:false, message:error.message});
   }
}

export {loginUser, registerUser, logoutUser};