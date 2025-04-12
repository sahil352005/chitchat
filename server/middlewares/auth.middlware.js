import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import jwt from 'jsonwebtoken';

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    try {
        // Get token from cookie or authorization header
        const token = req.cookies.token || req.headers['authorization']?.replace("Bearer ", "");
        
        if (!token) {
            return next(new errorHandler("Please login to access this resource", 401));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return next(new errorHandler("Invalid token", 401));
        }

        req.user = decoded;
        next();
    } catch (error) {
        return next(new errorHandler("Authentication failed", 401));
    }
});