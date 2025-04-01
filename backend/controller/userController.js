import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

//@desc Auth user and get token
//@route POST /api/users/login
const authUser = asyncHandler(async(req,res)=>{
    
    const{email,password}=req.body;

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        
        generateToken(res,user._id);

        res.status(200).json({_id:user._id,name:user.name,email:user.email,isAdmin:user.isAdmin});
    }else{
        res.status(401).json({message:'Invalid Email or Password'})
    }

})

//@desc Register user
//@route POST /api/users
const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400).json({message:'User Already Exists'})
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        generateToken(res,user._id);

        res.status(201).json({
            _id:user._id,name:user.name,email:user.email,isAdmin:user.isAdmin
        })
    }else{
        res.status(400).json({message:'Invalid User Data'});
    }
})

//@desc Logout user and Clear Cookie
//@route POST /api/users/logout
const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    })

    res.status(200).json({message:'Logged Out Successfully'});
})

//@desc Get user profile
//@route GET /api/users/profile
const getUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
        res.status(200).json({_id:user._id,name:user.name,email:user.email,isAdmin:user.isAdmin});

    }else{
        res.status(404).json({message:'User not Found'})
    }
})

//@desc Update user profile
//@route PUT /api/users/profile
const updateUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
        user.name= req.body.name || user.name;
        user.email= req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }

        const updateUser= await user.save();

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,

        })
    }else{
        res.status(404),json({message:'User not Found'});
    }
})

//@desc Get user 
//@route GET /api/users
const getUsers = asyncHandler(async(req,res)=>{
    res.send('Get Users');
})

//@desc Get user by Id
//@route GET /api/users/:id
const getUserById = asyncHandler(async(req,res)=>{
    res.send('Get User By Id');
})

//@desc Delete user 
//@route DELETE /api/users/:id
const deleteUser = asyncHandler(async(req,res)=>{
    res.send('Delete Users');
})

//@desc Update user 
//@route PUT /api/users/:id
const updateUser = asyncHandler(async(req,res)=>{
    res.send('Update Users');
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}
