import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// NOTE:
// @desc            Authenticate user & get token
// @route           POST /api/users/login
// @access          Public
// asyncHandler:    allows us to avoid using try/catch block for async functions (async functions returns a promise).
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Note: Because "user" is tied to the "User" model, the plain text password is passed on to the "matchPassword" method, as the "enteredPassword".
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// NOTE:
// @desc            Register User
// @route           POST /api/users
// @access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  // Note: create user if user does not exist
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
});

// NOTE:
// @desc            Logout User & clear cookie
// @route           POST /api/users/logout
// @access          Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "You've logged out successfully" });
});

// NOTE:
// @desc            Get user profile
// @route           GET /api/users/profile
// @access          Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found!");
  }
});

// NOTE:
// @desc            Update user profile
// @route           PUT /api/users/profile
// @access          Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found!");
  }
});

// NOTE:
// @desc            Get users
// @route           GET api/users
// @access          Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;
  const count = await User.countDocuments();

  const users = await User.find({})
    .sort({ createdAt: "desc" })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.status(200).json({ users, page, pages: Math.ceil(count / pageSize) });
});

// NOTE:
// @desc            Get user by ID
// @route           GET api/users/:id
// @access          Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// NOTE:
// @desc            Delete user
// @route           DELETE api/users/:id
// @access          Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // console.log(user);

  if (user) {
    // ifelse statement to be removed in deployment

    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// NOTE:
// @desc            Update user
// @route           PUT api/users/:id
// @access          Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Note: ifelse statement to be removed in deployment

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // user.password = req.body.password || user.password;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated",
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
