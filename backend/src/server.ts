import express, {Request, Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import {getPool} from "./config/db";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", async (req: Request, res: Response) => {
  try {
    await getPool();
    res.json({status: "ok", db: "connected"});
  } catch (err: any) {
    res.status(500).json({status: "error", message: err.message});
  }
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
