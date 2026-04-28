const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email or phone already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Dynamic UPI Generation (Example: amit954@phonepe)
    const sanitizedName = name.replace(/\s/g, "").toLowerCase();
    const upiId = `${sanitizedName}${Math.floor(Math.random() * 10000)}@phonepe`;

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      upiId, // New Feature
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        upiId: user.upiId,
        balance: user.balance,
        hasMpinSet: false,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        cname: user.name,
        email: user.email,
        phone: user.phone,
        upiId: user.upiId,
        balance: user.balance,
        hashMpinSet: user.hashMpinSet,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid  email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -mpin");
    if (user) {
      const response = user.toObject();
      response.hasMpinSet = !!user.mpin;
      res.json(response);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const setMpin = async (req, res) => {
  try {
    const { mpin } = req.body;
    if (!mpin || mpin.length < 4) {
      return res.status(400).json({ message: "MPIN must be 4 digits" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedMpin = await bcrypt.hash(mpin.toString(), salt);
    const user = await User.findById(req.user._id);
    user.mpin = hashedMpin;
    await user.save();
    res.json({ message: "MPIN set successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  setMpin,
};
