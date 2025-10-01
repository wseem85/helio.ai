const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sql = require('./config/db.js');
const connectCloudinary = require('./config/cloudinary.js');
const { clerkMiddleware, requireAuth } = require('@clerk/express');
const aiRouter = require('./routes/aiRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const app = express();
connectCloudinary();
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://helio-ai-nu.vercel.app'],
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());
app.use(requireAuth());
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);
app.get('/', (req, res) => res.send('Server is Live'));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});
