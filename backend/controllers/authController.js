const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const crypto = require('crypto');

//Register User - /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  let avatar;
  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get('host')}`;
  }

  // Check if an avatar is uploaded, else set a default avatar
  if (req.file) {
      avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
  } else {
      // Set a default avatar URL or path if not provided
      avatar = `${BASE_URL}/uploads/user/default-avatar.jpg`;
  }

  const user = await User.create({
      name,
      email,
      password,
      avatar,
  });
  sendToken(user, 201, res);
});


//Login User - /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const {email, password} =  req.body

    if(!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    //finding the user database
    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }
    
    if(!await user.isValidPassword(password)){
        return next(new ErrorHandler('Invalid email or password', 401))
    }
    sendToken(user, 201, res)
    
});

//Logout - /api/v1/logout
exports.logoutUser = (req, res, next) => {
        res.cookie('token',null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        .status(200)
        .json({
            success: true,
            message: "Loggedout"
        })

}
//forgotPassword =/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }
          
    // Generate and hash the reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes

    await user.save({ validateBeforeSave: false });

    // Send the unhashed token in the email
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    // Send email logic goes here...
    res.status(200).json({
        success: true,
        message: `Reset password email sent to ${user.email}`,
        resetUrl,
    });
});


// ResetPassword = /password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // Hash the token from the URL params
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() }, // Token should not be expired
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
    }

    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });
    sendToken(user, 200, res); // Sends JWT for auto-login after reset
});

//Get User Profile = /myprofile
exports.getUserProfile= catchAsyncError (async(req, res, next)=>{
    const user= await User.findById(req.user.id)
    res.status(200).json({
       success:true,
       user 
    })
});

//Change Password
exports.changePassword =  catchAsyncError (async(req, res, next)=>{
    const user= await User.findById(req.user.id).select('+password');

    //check old Password
    if(!await user.isValidPassword(req.body.oldPassword)){
       return next(new ErrorHandler('Old password is incorrect',401))
    }

    //assigning new password
    user.password=req.body.password;
    await user.save();
    res.status(200).json({
        success:true,
    })
});

//Update Profile
exports.updateProfile = catchAsyncError (async(req, res, next)=>{
  const newUserDate = {
    name:req.body.name,
    email:req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id,newUserDate,{
    new:true,
    runValidators:true,
  });

  res.status(200).json({
    success:true,
    user,
  });
});   

//Admin: Get All User = /api/v1/admin/users
exports.getAllUser = catchAsyncError(async(req, res, next)=>{
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

//Admin: Get Specific User = http://localhost:5000/api/v1/admin/user/:id
exports.getUser = catchAsyncError(async(req, res, next)=>{
 const user = await User.findById(req.params.id);
 if(!user){
    return next(new ErrorHandler (`User not found Wit this id ${req.params.id}`))
 }
 res.status(200).json({
    success: true,
    user
});
});

//Admin: Update User
exports.updateUser = catchAsyncError(async(req, res, next)=>{
 const newUserData={
    name: req.body.name,
    email:req.body.email,
    role:req.body.role
 }

 const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
    new:true,
    runValidators:true,

 })

 res.status(200).json({
    success:true,
    user
 });
});

//Admin: Delete User
exports.deleteUser = catchAsyncError(async(req, res, next)=>{
  const user = await User.findById(req.params.id); 
  if(!user){
    return next(new ErrorHandler (`User not found Wit this id ${req.params.id}`))
 }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success:true
  })
})