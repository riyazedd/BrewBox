import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js';

//@desc Auth user and get token
//@route POST /api/users/login
const authUser = asyncHandler(async(req,res)=>{
    res.send('Auth User');
})

//@desc Register user
//@route POST /api/users
const registerUser = asyncHandler(async(req,res)=>{
    res.send('Register User');
})

//@desc Logout user and Clear Cookie
//@route POST /api/users/logout
const logoutUser = asyncHandler(async(req,res)=>{
    res.send('Logout User');
})

//@desc Get user profile
//@route GET /api/users/profile
const getUserProfile = asyncHandler(async(req,res)=>{
    res.send('Get User Profile');
})

//@desc Update user profile
//@route PUT /api/users/profile
const updateUserProfile = asyncHandler(async(req,res)=>{
    res.send('Update User Profile');
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
