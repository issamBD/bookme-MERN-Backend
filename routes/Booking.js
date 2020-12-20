import express from "express";
import {
  createBooking,
  getCalendar,
  deleteBooking,
  getAllBookings,
  getNumber,
  getBooking,
} from "../controllers/bookings.js";
const app = express();
const router = express.Router();

router.post("/create", createBooking);
router.delete("/delete", deleteBooking);
router.post("/getCalendar", getCalendar);
router.post("/all", getAllBookings);
router.post("/getNumber", getNumber);
router.post("/getBooking", getBooking);

export default router;
