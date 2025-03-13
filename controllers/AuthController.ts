import { Request, Response } from "express";
import User from "../models/sqlModel/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Store securely

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    await Promise.all([
      body("name").notEmpty().withMessage("Name is required").run(req),
      body("email").isEmail().withMessage("Valid email is required").run(req),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    await Promise.all([
      body("email").isEmail().withMessage("Valid email is required").run(req),
      body("password").notEmpty().withMessage("Password is required").run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
