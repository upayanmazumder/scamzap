import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import scamRouters from './routes/scamRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'API is online' });
});
app.use('/users', userRoutes);
app.use('/scams', scamRouters);
app.use('/lessons', lessonRoutes);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
