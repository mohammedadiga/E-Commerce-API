import jwt from 'jsonwebtoken';

// Create a JWT token
export default function generateToken(id){
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"});
}