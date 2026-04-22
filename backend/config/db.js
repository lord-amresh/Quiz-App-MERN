import mongoose from 'mongoose';

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://amresh981806:quizapp123@cluster0.jtyisut.mongodb.net/QuizApp')
    .then(() => {console.log('MongoDB connected successfully') })
}  