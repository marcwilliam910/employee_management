import {Router, Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {getPool, sql} from "../config/db";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({message: "Username and password are required"});
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query("SELECT * FROM Users WHERE username = @username");

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    const token = jwt.sign(
      {id: user.id, username: user.username},
      process.env.JWT_SECRET as string,
      {expiresIn: "8h"},
    );

    res.json({
      token,
      user: {id: user.id, username: user.username},
    });
  } catch (err: any) {
    res.status(500).json({message: "Server error", error: err.message});
  }
});

export default router;
