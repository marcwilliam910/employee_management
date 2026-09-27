import {Router, Response} from "express";
import {getPool, sql} from "../config/db";
import {authMiddleware, AuthRequest} from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/", async (req: AuthRequest, res: Response) => {
  const {name, email, position, department, salary, dateHired} = req.body;

  if (!name || !email || !position || !department || !salary || !dateHired) {
    return res.status(400).json({message: "All fields are required"});
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("position", sql.NVarChar, position)
      .input("department", sql.NVarChar, department)
      .input("salary", sql.Decimal(10, 2), salary)
      .input("dateHired", sql.Date, dateHired)
      .query(`INSERT INTO Employees (name, email, position, department, salary, dateHired)
              OUTPUT INSERTED.*
              VALUES (@name, @email, @position, @department, @salary, @dateHired)`);

    res.status(201).json(result.recordset[0]);
  } catch (err: any) {
    if (err.number === 2627) {
      return res.status(409).json({message: "Email already exists"});
    }
    res.status(500).json({message: "Server error", error: err.message});
  }
});

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT * FROM Employees ORDER BY id DESC");
    res.json(result.recordset);
  } catch (err: any) {
    res.status(500).json({message: "Server error", error: err.message});
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM Employees WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({message: "Employee not found"});
    }

    res.json(result.recordset[0]);
  } catch (err: any) {
    res.status(500).json({message: "Server error", error: err.message});
  }
});

router.put("/:id", async (req: AuthRequest, res: Response) => {
  const {name, email, position, department, salary, dateHired} = req.body;

  if (!name || !email || !position || !department || !salary || !dateHired) {
    return res.status(400).json({message: "All fields are required"});
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("position", sql.NVarChar, position)
      .input("department", sql.NVarChar, department)
      .input("salary", sql.Decimal(10, 2), salary)
      .input("dateHired", sql.Date, dateHired)
      .query(`UPDATE Employees
              SET name = @name, email = @email, position = @position,
                  department = @department, salary = @salary, dateHired = @dateHired
              OUTPUT INSERTED.*
              WHERE id = @id`);

    if (result.recordset.length === 0) {
      return res.status(404).json({message: "Employee not found"});
    }

    res.json(result.recordset[0]);
  } catch (err: any) {
    if (err.number === 2627) {
      return res.status(409).json({message: "Email already exists"});
    }
    res.status(500).json({message: "Server error", error: err.message});
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM Employees OUTPUT DELETED.* WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({message: "Employee not found"});
    }

    res.json({message: "Employee deleted"});
  } catch (err: any) {
    res.status(500).json({message: "Server error", error: err.message});
  }
});

export default router;
