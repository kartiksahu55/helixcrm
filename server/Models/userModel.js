import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
    },

    lName: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exist"],
      minlength: [6, "Minimum email length is 6 characters"],
      maxlength: [50, "Maximum email length is 50 characters"],
      trim: true,
    },

    phone: {
      type: Number,
      required: true,
      unique: [true, "Phone Number already exist"],
      trim: true,
    },

    firmName: {
      type: String,
      required: true,
      default: "Referral Program",
    },

    sector: {
      type: String,
      trim: true,
      required: true,
      enum: ["Real Estate", "Banking", "Interior", "All"],
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    password: {
      type: String,
      required: [true, "Please enter a valid password"],
      minlength: [8, "Minimum password length is 8 characters"],
      trim: true,
      select: true,
    },

    joiningDate: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
      required: false,
    },

    //   Bank Detail Start-------

    panNumber: {
      type: String,
      // trim: true,
    },

    bankName: {
      type: String,
      trim: true,
    },

    accountNumber: {
      type: String,
      trim: true,
    },

    ifsc: {
      type: String,
      trim: true,
    },
    //   Bank Detail End-------

    avatar: {
      public_id: { type: String },
      secure_url: { type: String },
    },

    role: {
      type: String,
      enum: ["super-admin", "admin", "employee", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // Encrypt Password
  this.password = await bcrypt.hash(this.password, 10);

  // Capitalize name
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  this.fName = capitalize(this.fName);
  this.lName = capitalize(this.lName);
  next();
});

userSchema.methods = {
  // Create json web token
  generateJWTToken: async function () {
    return Jwt.sign(
      {
        id: this._id,
        email: this.email,
        phone: this.phone,
        firmName: this.firmName,
        role: this.role,
        sector: this.sector,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },

  // Compare password function methode
  comparePassword: async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
  },
};

const User = model("User", userSchema);

export default User;
