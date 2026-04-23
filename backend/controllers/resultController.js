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

// List the results (Renamed from getResults to listResults to fix your error)
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