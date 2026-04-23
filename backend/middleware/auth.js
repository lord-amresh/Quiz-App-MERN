import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// It's better to use your .env variable, but keeping your logic intact:
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export default async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check if header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, Token missing' 
            });
        }

        // 2. Get the token from the header
        const token = authHeader.split(' ')[1];

        // 3. Verify token
        const payload = jwt.verify(token, JWT_SECRET);

        // 4. Find the user
        const user = await User.findById(payload.id).select('-password');

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // 5. Attach user to request and move to next middleware/controller
        req.user = user;
        next();

    } catch (err) {
        console.error('JWT VERIFICATION FAILED:', err);
        return res.status(401).json({ 
            success: false, 
            message: 'Token invalid or expired' 
        });
    }
}