import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/User.js";
import toolRouter from "./routes/Tools.js";
import bookingRouter from "./routes/Booking.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/users", userRouter);
app.use("/tools", toolRouter);
app.use("/bookings", bookingRouter);
app.get("/", (req, res) => {
  res.send("hello world this is bookme");
});

const CONNECTION_URL = process.env.db;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
