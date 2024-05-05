import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import User from '../models/userModel.js';



export const authMiddleware = asyncHandler(async (req, res, next) => {

    let token;

    if(req?.headers?.authorization?.startsWith('Bearer')){

        token = req.headers.authorization.split(" ")[1]

        try {

            if(token){

                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const user = await User.findById(decoded?.id)

                req.user = user;
                next();

            }
            
        } catch (error) {
            throw new Error ("Not Authorized Token expired, Please Login again.");
        }

    } else {
        throw new Error ("There is no token attached to header");
    }

});

export const isAdmin = asyncHandler(async (req, res, next) => {

    const { email } = req.user;
    const adminUser = await User.findOne({ email });

    if(adminUser.role === "admin"){

        next();

    }else{
        throw new Error("You ara not an admin")
    }

});