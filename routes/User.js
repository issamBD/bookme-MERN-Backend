import express from "express";
import {
  registerUser,
  loginUser,
  validateToken,
  getUser,
} from "../controllers/users.js";
import auth from "../middleWare/auth.js";

const app = express();
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/validateToken", validateToken);
router.get("/", auth, getUser);

export default router;
