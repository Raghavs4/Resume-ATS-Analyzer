import express from 'express';
import authentication from '../middleware/authentication.js';
import upload from '../middleware/upload.js';
import { uploadResume , getResumeHistory} from '../controller/resumeController.js';

const resumeRouter = express.Router();

resumeRouter.post("/upload", authentication, upload.single("resume"), uploadResume  );
resumeRouter.get("/history",authentication, getResumeHistory );

export default resumeRouter;