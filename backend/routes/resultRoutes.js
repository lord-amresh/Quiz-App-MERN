import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { createResult, listResults, getLeaderboard } from '../controllers/resultController.js';

const resultRouter = express.Router();

// Route to save a new quiz result[cite: 6]
resultRouter.post('/', authMiddleware, createResult);

// Route to get the logged-in user's personal history[cite: 6]
resultRouter.get('/', authMiddleware, listResults);

// New route to get the top rankings (Leaderboard)
resultRouter.get('/leaderboard', authMiddleware, getLeaderboard);

export default resultRouter;