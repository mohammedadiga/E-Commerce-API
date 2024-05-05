import asyncHandler from 'express-async-handler';
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import User from '../models/userModel.js';
import generateToken from '../config/jwtToken.js'
import validateMongodbid from '../utils/validateMongodbid.js';
import generateRefreshToken from '../config/refreshtoken.js'
import sendEmail from '../config/nodemailer.js'

// Register
export const register = asyncHandler(async (req, res) => {

  const { email} = req.body;

  try {
    
    // check if user already exists or not
    const findUser = await User.findOne({ email });

    if(findUser) throw new Error("User Already Exists!");

    const user = new User(req.body);

    const refreshToken = generateRefreshToken(user.id);
    user.refreshToken = refreshToken;

    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    });

    res.json(user);

  } catch (error) {
    throw new Error(error);
  }

});

// login a user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    
    // check if user already exists or not
    const findUser = await User.findOne({ email });

    if (findUser && (await findUser.isPasswordMatched(password))) {
      
      const refreshToken = generateRefreshToken(findUser.id);

      const user = findUser
      user.refreshToken = refreshToken;

      await user.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      });

      res.json({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user?.id),
      });

    } else {
      throw new Error("Invalid Credent");
    }




  } catch (error) {
    throw new Error(error);
  }




});

// Unblock a user
export const logout = asyncHandler(async (req, res) => {

  try {

    const cookie = req.cookies;

    if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookie");

    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken });

    if (!user) {
      res.clearCookie("refreshToken", { httpOnly: true, secure: true });
      return res.sendStatus(204); // forbidden
    }

    user.refreshToken = null;
    user.save();

    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(204); // forbidden

  } catch (error) {
    throw new Error(error);
  }

});

// Handle Refresh Token
export const handleRefreshtoken = asyncHandler(async (req, res) => {
  
  try {
    const cookie = req.cookies;

    if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookie");

    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh presses in db or not matched");

    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err || user.id !== decoded.id)
        throw new Error("There is something wrong with refresh token");

      const accessToken = generateToken(user?.id);
      res.json({ accessToken });
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update User Password
export const updatePassword = asyncHandler(async (req, res) => {
  
  const { id } = req.user;
  const { password } = req.body;
  validateMongodbid(id);

  const user = await User.findById(id);

  if (password) {
    
    try {
      
      user.password = password;
      await user.save();
      res.json(user);

    } catch (error) {
      throw new Error(error);
    }

  } else {
    res.json(user);
  }

});

// Forgot Password
export const forgotPasswordToken = asyncHandler(async (req, res) => {

  const { email } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) throw new Error ("User not found with this email");
    
    const token = await user.passwordReset();
    await user.save();

    const resetURL = `Hi, Please follow this link to reset your password. This  link is valid till 10 minutes from now, <button><a href='http://localhost:8000/api/auth/reset-password/${token}'>Click</a></button>`
    const data = {
      to: email,
      subject: "Forgot Password Link",
      text: "Hey User",
      html: resetURL,
    }

    sendEmail(data);
    res.json(token);

  } catch (error) {
    throw new Error(error);
  }

});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  try {
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
  
    if (!user) throw new Error(" Token Expired, Please try again later");
  
    user.password = password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
  
    user.save();
    res.json(user);

  } catch (error) {
    throw new Error(error);
  }

});