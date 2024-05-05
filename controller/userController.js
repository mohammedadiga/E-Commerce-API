import asyncHandler from 'express-async-handler';

import User from '../models/userModel.js';
import validateMongodbid from '../utils/validateMongodbid.js';


// Get all user
export const getAllUser = asyncHandler(async (req, res) => {

    try {
        
        const users = await User.find()
        res.json(users);

    } catch (error) {
        throw new Error(error);
    }

});

// Get a singl user
export const getaUser = asyncHandler(async (req, res) => {

    const { id } = req.user
    validateMongodbid(id);

    try {

        const user = await User.findById(id);
        res.json(user);
            
    } catch (error) {
        throw new Error(error);
    }

});

// Update a user
export const updateUser = asyncHandler(async (req, res) => {

    const { id } = req.user
    validateMongodbid(id);

    try {
          
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json(user);

    } catch (error) {
        throw new Error(error);
    }

});

// Delete a user
export const deleteUser = asyncHandler(async (req, res) => {

    const { id } = req.params
    validateMongodbid(id);

    try {
            
        const user = await User.findByIdAndDelete(id);
        res.json(user);

    } catch (error) {
        throw new Error(error);
    }

});

// Block a user
export const blockUser = asyncHandler(async (req, res) => {

    const { id } = req.params
    validateMongodbid(id);

    try {
            
        const user = await User.findById(id);

        if (user.isBlocked) throw new Error('User Already Blocked');

        user.isBlocked = true;
        user.save();

        res.json({ message: "User Blocked" });

    } catch (error) {
        throw new Error(error);
    }

});

// Unblock a user
export const unblockUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongodbid(id);

    try {
           
        const user = await User.findById(id);

        if (!user.isBlocked) throw new Error('User Already Unblocked');

        user.isBlocked = false;
        user.save();

        res.json({ message: "User Unblocked" });

    } catch (error) {
        throw new Error(error);
    }

});

// Get user Washlist
export const getWashlist = asyncHandler(async (req, res) => {

    const { id } = req.user;
    validateMongodbid(id);

    try {
            
        const userWashlist = await User.findById(id).populate('wishlist');
        res.json(userWashlist);

    } catch (error) {
        throw new Error(error);
    }

});

// User Address
export const userAddress = asyncHandler(async (req, res) => {

    const { id } = req.user
    validateMongodbid(id);

    try {

        const userAddress = await User.findByIdAndUpdate(id, {address: req?.body?.myAddress}, { new: true })
        res.json(userAddress);

    } catch (error) {
        throw new Error(error);
    }

});