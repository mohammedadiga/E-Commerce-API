import jwt from 'jsonwebtoken';

// Create a JWT token
export default function generateRefreshToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });
};