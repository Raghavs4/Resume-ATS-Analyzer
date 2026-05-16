import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resumes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume", // ✅ matches Resume model name
      },
    ],
  },
  { timestamps: true }
);

// ✅ Correct model reuse pattern
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
