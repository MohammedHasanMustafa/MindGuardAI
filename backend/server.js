import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js'
import chatbotRoutes from './routes/chatbotRoutes.js';
import selfAssessmentRoutes from './routes/selfAssessmentRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js';
import SearchRoutes from './routes/searchRoutes.js'
import suggestionRoutes from './routes/suggestionRoutes.js';

dotenv.config(); 

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const startServer = async () => {
  await connectDB();
  
  app.use('/api/auth', userRouter);
  app.use("/api/conversations", conversationRoutes);
  app.use("/api/chatbot", chatbotRoutes);
  app.use('/api', selfAssessmentRoutes);
  app.use('/api/user', settingsRoutes);
  app.use('/api/search', SearchRoutes);
  app.use('/api/suggestions', suggestionRoutes);

  app.get('/', (req, res) => res.send("API Working"));

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
