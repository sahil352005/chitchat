import { createUser, getUserByUsername, getUserById, getOtherUsers } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { username, password, fullName, gender } = req.body;
    
    if (!username || !password || !fullName || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    console.log('Checking for existing user:', username);
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      console.log('User already exists:', username);
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log('Creating new user:', { username, fullName, gender });
    const user = await createUser({
      username,
      password: hashedPassword,
      fullName,
      gender,
      avatar: `https://avatar.iran.liara.run/public/${gender === "male" ? "boy" : "girl"}?username=${username}`
    });
    console.log('User created successfully:', user.userId);

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        gender: user.gender,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        gender: user.gender,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        gender: user.gender,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getOtherUsersList = async (req, res, next) => {
  try {
    const users = await getOtherUsers(req.user.userId);
    res.json({
      users: users.map(user => ({
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        gender: user.gender,
        avatar: user.avatar
      }))
    });
  } catch (error) {
    next(error);
  }
};
