import Result from "../models/resultModel.js";

export async function createResult(req, res) {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Notauthorized"
            });
        }
        
    } catch (error) {
        
    }