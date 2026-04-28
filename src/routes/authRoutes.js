const express = require("express");
const { registerUser, loginUser, getProfile, setMpin } = require("../controllers/authController");
const router = express.Router();
const { protect } = require("../middleware/authMIddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile); 
router.post("/set-mpin", protect, setMpin);


module.exports = router;