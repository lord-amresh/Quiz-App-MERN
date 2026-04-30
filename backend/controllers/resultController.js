import Result from "../models/resultModel.js";

// Create a new result
export async function createResult(req, res) {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        const { title, technology, level, totalQuestions, correct, wrong } = req.body;
        
        if (!technology || !level || totalQuestions === undefined || correct === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Missing title"
            });
        }

        // compute wrong if not provided
        const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));

        const payload = {
            title: String(title).trim(),
            technology,
            level,
            totalQuestions: Number(totalQuestions),
            correct: Number(correct),
            wrong: computedWrong,
            user: req.user._id   // Using ._id for consistency
        };

        const created = await Result.create(payload);
        return res.status(201).json({
            success: true,
            message: 'Result created',
            result: created
        });   
        
    } catch (err) {
        console.error("createResult Error:", err);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

// List the results for the logged-in user
export async function listResults(req, res) {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        const { technology } = req.query;

        const query = { user: req.user._id };
        if (technology && technology.toLowerCase() !== "all") {
            query.technology = technology;
        }

        const items = await Result.find(query).sort({ createdAt: -1 }).lean();
        
        return res.json({
            success: true,
            results: items
        });
        
    } catch (err) {
        console.error("listResults Error:", err);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

// Get top scores across all users for the Leaderboard
export async function getLeaderboard(req, res) {
    try {
        const { technology } = req.query;
        const query = {};
        
        // Filter by technology if it's not "all"
        if (technology && technology.toLowerCase() !== "all") {
            query.technology = technology.toLowerCase();
        }

        // 1. Sort by score (highest first)
        // 2. Populate 'user' to get the student's name
        // 3. Limit to top 10 for a clean UI
        const topScores = await Result.find(query)
            .populate('user', 'name') 
            .sort({ score: -1, createdAt: 1 })
            .limit(10)
            .lean();

        return res.json({
            success: true,
            leaderboard: topScores
        });
    } catch (err) {
        console.error("getLeaderboard Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error fetching leaderboard"
        });
    }
}