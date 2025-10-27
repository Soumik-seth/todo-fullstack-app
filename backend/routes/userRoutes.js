const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();

// Configure email transporter - FIXED TYPO HERE
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/users/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret123", { expiresIn: "1h" });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/forgot-password - Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if email exists
      return res.json({ 
        success: true,
        message: "If the email exists, an OTP has been sent" 
      });
    }

    // Generate OTP and set expiry (10 minutes)
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP to user in database
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = otpExpiry;
    await user.save();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP - Todo App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.username},</p>
          <p>You requested to reset your password. Use the OTP below to verify your identity:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 20px; border-radius: 10px; 
                        font-size: 32px; font-weight: bold; letter-spacing: 8px;
                        display: inline-block;">
              ${otp}
            </div>
          </div>
          <p style="color: #ff0000; font-weight: bold;">
            This OTP will expire in 10 minutes.
          </p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            For security reasons, do not share this OTP with anyone.
          </p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true,
      message: "If the email exists, an OTP has been sent" 
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/verify-otp - Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ 
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired OTP" 
      });
    }

    // OTP is valid - generate a reset token for the frontend
    const resetToken = jwt.sign(
      { id: user._id, purpose: 'password_reset' }, 
      process.env.JWT_SECRET || "secret123", 
      { expiresIn: '15m' }
    );

    res.json({ 
      success: true,
      message: "OTP verified successfully",
      resetToken 
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/reset-password - Reset password with token
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET || "secret123");
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Check if token is for password reset
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ message: "Invalid token purpose" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ 
      success: true,
      message: "Password reset successfully" 
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;