import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./route/userRoute.js";
import resumeRouter from "./route/resumeRoute.js";

//app config
dotenv.config();
const app = express();

//middlewares
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true, 
}));
app.use(express.json());


//db connection
connectDB();


//api endpoints
app.use("/api/user", userRouter);
app.use("/api/resume",resumeRouter);




app.get("/", (req,res) => {
    res.send("Server is Running");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log("HLO");
})