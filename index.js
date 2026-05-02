const express=require("express");
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const app=express();
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/authDB");
const JWT_SECRET="mysecretkey";

const userSchema=new mongoose.Schema({
  name:String,
  email:{type:String,unique:true},
  password:String,
  token:String
});

const User=mongoose.model("User",userSchema);
const verifyToken=async(req,res,next)=>{
  try{
    const authHeader=req.headers.authorization;
    
  }catch(err){
    res.status(401).json({message:"Unauthorized"});
  }
};

app.post("/register",async(req,res)=>{
  try{
    const{name,email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(existingUser)return res.status(400).json({message:"User already exists"});
    const hashedPassword=await bcrypt.hash(password,10);
    const user=new User({name,email,password:hashedPassword});
    await user.save();
    res.status(201).json({message:"User registered successfully"});
  }catch(err){
    res.status(500).json({message:"Server error"});
  }
});



app.post("/logout",verifyToken,async(req,res)=>{
  req.user.token=null;
  await req.user.save();
  res.json({message:"Logged out successfully"});
});

app.listen(3000,()=>{
  console.log("Server running on port 3000");
});

