import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from "./routes/listing.route.js"
import cookieParser from "cookie-parser"
import uploadRouter from './routes/upload.route.js'
import cors from 'cors'

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("connected to mongodb")
}).catch((err) => {
    console.log(err)
});

const app = express();

// Update CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes - group all routes together
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/upload', uploadRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});