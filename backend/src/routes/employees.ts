import {Router} from "express";
import {authMiddleware} from "../middleware/auth";
import {
  getReportSummary,
  getReportPdf,
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController";

const router = Router();

router.use(authMiddleware);

router.get("/report/summary", getReportSummary);
router.get("/report/pdf", getReportPdf);
router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
