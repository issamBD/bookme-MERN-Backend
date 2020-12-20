import express from "express";
import {
  createTool,
  deleteTool,
  getAllTools,
  getNumber,
  getTool,
  updateStatus,
} from "../controllers/tools.js";
const app = express();
const router = express.Router();

router.post("/create", createTool);
router.delete("/delete", deleteTool);
router.post("/all", getAllTools);
router.post("/getNumber", getNumber);
router.post("/getTool", getTool);
router.post("/updateStatus", updateStatus);

export default router;
