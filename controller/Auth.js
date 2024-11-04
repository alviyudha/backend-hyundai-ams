import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const login = async (req, res) => {
    try {
      console.log("Request body", req.body);
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ msg: "Username and Password needed" });
      }
  
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
  
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }
  
      const match = await argon2.verify(user.password, password);
      if (!match) {
        return res.status(400).json({ msg: "Password Wrong" });
      }
  
      const { cuid, role } = user;
  
      const token = jwt.sign({ cuid, username, role }, JWT_SECRET, {
        expiresIn: "1h",
      }); // Token expires in 1 hour
  
      return res.json({
        status: "success",
        message: "ok",
        data: {
          token,
        },
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

export const getLogin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        cuid: decoded.cuid,
      },
      select: {
        cuid: true,
        username: true,
        role: true, // Tambahkan field 'role' di sini
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json({
      status: "success",
      message: "ok",
      data: {
        user: {
          cuid: user.cuid,
          username: user.username,
          role: user.role, // Kembalikan 'role' di respons
        },
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const logOut = async (req, res) => {
    try {
      return res.json({
        status: "success",
        message: "Logged out successfully",
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
