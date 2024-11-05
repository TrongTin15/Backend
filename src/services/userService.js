const User = require("../models/user");
require("dotenv").config();
const bcrypt=require('bcrypt');
const jwt =require("jsonwebtoken")
const saltRounds =10;

const createUserService = async(name,email,password) => {
    try {
        // check email exist
        const user = await User.findOne({email})
        if (user) {
            console.log("Please choose other email")
            return null;
        }
        // hash password
        const hashPassword = await bcrypt.hash(password,saltRounds)
        //save user to db
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role:"hello"
            
        })

        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const loginService = async(email1,password) => {
    try {
        
        // fetch user by email
        const user=await User.findOne({email:email1})
        
        if (user) {
            const isMatchPassword= await bcrypt.compare(password,user.password)
           if (!isMatchPassword) {
               
            return{
                EC: 2,
                EM: "Email,password is not correct"
            }
         } else{
            const payload ={
                email:user.email,
                name:user.name
            }
            const access_token =jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                  expiresIn:  process.env.JWT_EXPIRE
                }
            )
                 return {
                    
                    access_token,
                user:{
                  email:user.email,
                  name:user.name
                }
                }
            }
        } else {
            return{
                EC: 1,
                EM: "Email,password is not correct",
            }
        }
        

    } catch (error) {
        console.log(error);
        return null;
    }
}



module.exports = {
    createUserService,loginService
}