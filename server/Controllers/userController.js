import User from "../Models/userModel.js";
import emailValidator from "email-validator";
import AppError from "../Utils/errorUtils.js";
import cloudinary from "../config/cloudinaryConfig.js";

const cookieOption = {
  path: "/",
  maxAge: 5 * 60 * 60 * 1000,
  httpOnly: true,
  secure: false,
  // sameSite: "none",
};

//Start Generate and Send OTP----------
const userOTP = async (req, res, next) => {
  try {
    const { keyToGenerateOtp, phone, OTPType } = req.body;

    const isPhoneExit = await User.findOne({ phone });

    if (isPhoneExit) {
      throw Error("Phone number already exit!");
    }

    const createOTP = () => {
      const otpLength = 6;
      let otp = [];

      for (let i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10);
      }

      return otp.toString();
    };

    const myOtp = createOTP();

    const sendFastToSmsOtp = async () => {
      const fast2sms_Api_URL = `https://www.fast2sms.com/dev/${OTPType}?authorization=${process.env.FAST_TO_SMS_API_KEY}&route=otp&variables_values=${myOtp}&flash=0&numbers=${phone}`;

      const response = await fetch(fast2sms_Api_URL);
      const resData = await response.json();
      console.log(req.body);
      res.status(200).json({
        success: true,
        otp: myOtp,
        message: "OTP Sent Successfully",
        otpResponse: resData,
      });
    };

    if (keyToGenerateOtp === process.env.CLIENT_SECRET_KEY_TO_SEND_OTP) {
      sendFastToSmsOtp();
    } else {
      throw new Error("Not Authorized to generate OTP!");
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//End Generate and Send OTP----------

//Start Create Account(SignUp)----------
const userSignUp = async (req, res, next) => {
  try {
    const { fName, lName, phone, email, sector, password } = req.body;

    const verifyEmail = emailValidator.validate(email);

    if (!verifyEmail) {
      throw Error("Please Enter a valid email address!");
    } else if (!fName || !lName || !phone || !email || !sector || !password) {
      throw Error("All field are required!");
    }

    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      throw Error("Email already exist!");
    }

    const date = new Date();
    const month = date.getMonth() + 1;
    const userId =
      "sr" +
      date.getDate() +
      month +
      date.getFullYear() +
      date.getHours() +
      date.getMinutes() +
      date.getSeconds();

    const user = await User.create({
      fName,
      lName,
      userId,
      phone,
      email,
      sector,
      role: userRole,
      password,
      avatar: "",
      panNumber: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
    });

    if (!user) {
      throw Error("Oops! Something went wrong.");
    }

    await user.save();

    user.password = null;

    console.log(user);

    const token = await user.generateJWTToken();

    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      data: user,
      message: "User created Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// End Create Account(SignUp)----------

// Start Update User Details
const userUpdateDetails = async (req, res, next) => {
  try {
    const id = req.params.id;

    const payload = { ...req.body };

    const user = await User.findOneAndUpdate({ _id: id }, payload);
    console.log(user);
    res.status(200).json({
      success: true,
      data: user,
      message: "Details saved successfully!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};
// End Add User Bank Details

// Start Login User----------
const userLogin = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    let user = {};

    // Check user provided email or phone
    if (email && password) {
      const checkValidEmail = emailValidator.validate(email);
      if (!checkValidEmail) {
        throw Error("Please enter a valid email address");
      }
      user = await User.findOne({ email }).select("+password");
    } else if (phone && password) {
      user = await User.findOne({ phone }).select("+password");
    }

    // Check user exist or not
    if (!user) {
      throw Error("User doesn't exist! Create an account.");
    } else {
      console.log(user);
    }

    const comparePass = await user.comparePassword(password);

    // Validate user password
    if (!user || !comparePass) {
      throw Error("User and Password doesn't match");
    }

    user.password = null;

    const token = await user.generateJWTToken();

    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      data: user,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// End Login User----------

// Start Logout User----------
const userLogout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      // secure: true,
      // sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "User Logged Out successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// End Logout User----------

// Start Fetch User----------
const userFetch = async (req, res, next) => {
  try {
    if (!req.user) {
      throw Error("Unauthenticated");
    }

    const user = await User.findById({ _id: req.user.id });

    user.password = null;

    res.status(200).json({
      success: true,
      message: "Data fetched succeffully",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: "failed",
    });
  }
};
// End Fetch User----------

// Start Create Super Admin User----------
const superAdminUserCreate = async (req, res, next) => {
  try {
    const {
      fName,
      lName,
      userId,
      email,
      phone,
      gender,
      password,
      avatar,
      firmName,
      role,
      secretId,
      secretKey,
    } = req.body;

    // Verify before create super admin
    if (role !== "super-admin") {
      return next(new AppError("Role not defined", 400));
    } else if (
      secretId !== process.env.SECRET_ID_TO_CREATE_SUPER_ADMIN ||
      secretKey !== process.env.SECRET_KEY_TO_CREATE_SUPER_ADMIN
    ) {
      return next(
        new AppError("Unauthenticated to create new Super Admin!", 400)
      );
    } else {
      const isEmailExist = await User.findOne({ email });
      const isPhoneExist = await User.findOne({ phone });

      if (isEmailExist && isPhoneExist) {
        return next(new AppError("Email and Phone already exist!", 400));
      } else if (isEmailExist) {
        return next(new AppError("Email address already exist!", 400));
      } else if (isPhoneExist) {
        return next(new AppError("Phone number already exist!", 400));
      }

      const user = await User.create({
        fName,
        lName,
        userId,
        email,
        phone,
        firmName,
        sector: "All",
        role,
        gender,
        password,
        avatar,
      });

      if (!user) {
        return next(new AppError("Oops! something went wrong.", 400));
      }

      user.password = null;

      res.status(200).json({
        success: true,
        message: "New super admin created successfully!",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};
// End Create Super Admin User----------

// Start Create Admin User----------
const adminUserCreate = async (req, res, next) => {
  try {
    const {
      fName,
      lName,
      userId,
      email,
      phone,
      sector,
      role,
      gender,
      password,
      avatar,
    } = req.body;

    const firmName = req.user.firmName;

    // Total Admin can exist per Sector
    const totalAdminAllow = 1;

    // Verify before create admin
    if (role !== "admin") {
      return next(new AppError("Role not defined", 400));
    } else {
      // Get Super Admin Id to create admin
      const superId = req.params.id;

      const validateSuperAdmin = await User.findOne({ _id: superId });

      if (!validateSuperAdmin) {
        return next(new AppError("Unauthorized to create new Admin", 401));
      } else if (validateSuperAdmin.role !== "super-admin") {
        return next(new AppError("Unauthorized to create new Admin", 401));
      }
    }

    const checkAdminPerSector = await User.find({
      firmName,
      role: "admin",
      sector,
    });
    console.log(checkAdminPerSector.length);
    const isEmailExist = await User.findOne({ email });
    const isPhoneExist = await User.findOne({ phone });

    if (checkAdminPerSector.length >= totalAdminAllow) {
      return next(
        new AppError(
          `${sector} admin already exist! One admin allow per sector`,
          400
        )
      );
    } else if (isEmailExist && isPhoneExist) {
      return next(new AppError("Email and Phone already exist!", 400));
    } else if (isEmailExist) {
      return next(new AppError("Email address already exist!", 400));
    } else if (isPhoneExist) {
      return next(new AppError("Phone number already exist!", 400));
    }

    const user = await User.create({
      fName,
      lName,
      userId,
      email,
      phone,
      sector,
      firmName,
      role,
      gender,
      password,
      avatar,
    });

    if (!user) {
      return next(new AppError("Oops! something went wrong.", 400));
    }

    res.status(200).json({
      success: true,
      message: "New admin created successfully!",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};
// End Create Admin User----------

// Start Create Employee User----------
const employeeUserCreate = async (req, res, next) => {
  try {
    const { firmName, role } = req.user;

    let {
      fName,
      lName,
      userId,
      designation,
      department,
      email,
      phone,
      sector,
      gender,
      password,
      joiningDate,
      avatar,
    } = req.body;

    console.log(req.body);
    if (role !== "super-admin") {
      sector = req.user.sector;
    }

    const isValidEmail = await emailValidator.validate(email);
    if (!isValidEmail) {
      return next(new AppError("Please Enter a valid email address!"));
    }

    const isEmailExist = await User.findOne({ email });
    const isPhoneExist = await User.findOne({ phone });
    const isUserIdExist = await User.findOne({ userId });

    if (isEmailExist && isPhoneExist) {
      return next(new AppError("Email and Phone already exist!", 400));
    } else if (isEmailExist) {
      return next(new AppError("Email address already exist!", 400));
    } else if (isPhoneExist) {
      return next(new AppError("Phone number already exist!", 400));
    } else if (isUserIdExist) {
      return next(new AppError("Employee Id already exist!", 400));
    }

    const user = await User.create({
      fName,
      lName,
      userId,
      designation,
      sector,
      firmName,
      role: "employee",
      department,
      email,
      phone,
      gender,
      joiningDate,
      password,
      avatar,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "New employee created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};
// End Create Employee User----------

// Start Fetch Employee User----------
const employeeUserFetch = async (req, res, next) => {
  try {
    const { firmName, role, sector } = req.user;

    let option = {};
    if (role === "super-admin") {
      option = { firmName, role: "employee" };
    } else {
      option = {
        firmName,
        role: "employee",
        sector,
      };
    }

    // Fetch employee data from database
    const employee = await User.find(option).select("-password");

    console.log(employee);

    res.status(200).json({
      success: true,
      message: "Employee data fetched successfully",
      data: employee,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};
// End Fetch Employee User----------

// Start Update Employee User
const employeeUserUpdateDetails = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const payload = req.body;

    const isValidEmployee = await User.findOne({ _id: employeeId });

    if (!isValidEmployee) {
      return next(new AppError("Employee doesn't exist!", 400));
    }

    const employee = await User.findOneAndUpdate({ _id: employeeId }, payload);

    res.status(200).json({
      success: true,
      message: "Employee details updated successfully!",
      data: { ...employee._doc, ...payload },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};
// End Update Employee User

// Start Upload User Avatar
const uploadUserAvatar = async (req, res, next) => {
  try {
    const { avatarFile, id } = req.body;

    let cloudinaryResponse = undefined;
    if (avatarFile) {
      cloudinaryResponse = await cloudinary.v2.uploader.upload(avatarFile, {
        folder: "SPECTICAL_ASSET_CRM",
        use_filename: true,
        transformation: [
          {
            height: 300,
          },
        ],
      });
      console.log("public_id: ", cloudinaryResponse?.public_id || "");
      console.log("secure_url: ", cloudinaryResponse.secure_url);
    }

    const payload = {
      avatar: {
        public_id: cloudinaryResponse?.public_id || "",
        secure_url: cloudinaryResponse?.secure_url || "",
      },
    };

    const user = await User.findOneAndUpdate({ _id: id }, payload);

    console.log(user);

    res.status(200).json({
      success: true,
      message: "Upload Avatar Successfully!",
      data: user,
    });
  } catch (error) {
    const errMessage = error.message || "Oops! Something went wrong.";
    console.log(errMessage);
    return next(new AppError(errMessage, 500));
  }
};
// End Upload User Avatar

export default {
  userOTP,
  userSignUp,
  userUpdateDetails,
  userLogin,
  userLogout,
  userFetch,
  superAdminUserCreate,
  adminUserCreate,
  employeeUserCreate,
  employeeUserFetch,
  employeeUserUpdateDetails,
  uploadUserAvatar,
};
