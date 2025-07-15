import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    // Unique username, required
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },

    // Unique email address, required and lowercased
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // User password (minimum 6 characters)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    // Optional profile picture URL
    profilePicture: {
      type: String,
      default: "",
      trim: true,
    },

    // Optional user bio (max 300 characters)
    bio: {
      type: String,
      default: "",
      maxlength: 300,
      trim: true,
    },

    // Fields for password reset functionality
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // Follow feature
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Hash password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is unchanged

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (err) {
    next(err); // Pass error to next middleware
  }
});

// Method to compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
const User = mongoose.model("User", userSchema);
export default User;
