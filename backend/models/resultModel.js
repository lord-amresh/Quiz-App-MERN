import mongoose from 'mongoose';

const performanceEnum = ["Excellent", "Good", "Average", "Needs Work"];

const ResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true, trim: true },
  technology: {
    type: String,
    required: true,
    enum: ["html", "css", "js", "react", "node", "mongodb", "java", "python", "cpp", "bootstrap"]
  },
  level: { 
    type: String, 
    required: true, 
    enum: ["basic", "intermediate", "advanced"] 
  },
  totalQuestions: { type: Number, required: true },
  correct: { type: Number, required: true },
  wrong: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  performance: { type: String, enum: performanceEnum, default: "Needs Work" }
}, { timestamps: true });

/**
 * Middleware Logic
 * We use an async function to avoid 'next is not a function' errors.
 * Standard 'function' keyword is used to ensure 'this' refers to the document.
 */
ResultSchema.pre('save', async function() {
  try {
    const total = Number(this.totalQuestions) || 0;
    const correct = Number(this.correct) || 0;

    // 1. Score Calculation
    this.score = total > 0 ? Math.round((correct / total) * 100) : 0;

    // 2. Performance Mapping
    if (this.score >= 85) this.performance = "Excellent";
    else if (this.score >= 65) this.performance = "Good";
    else if (this.score >= 45) this.performance = "Average";
    else this.performance = "Needs Work";

    // 3. Wrong Count Calculation
    this.wrong = Math.max(0, total - correct);

    // In async middleware, the hook finishes when the function returns.
  } catch (err) {
    throw err; // Throwing an error stops the save process
  }
});

// Final Model Export
const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);
export default Result;