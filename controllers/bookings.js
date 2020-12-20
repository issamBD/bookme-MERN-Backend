import Tool from "../models/Tool.js";
import Booking from "../models/Booking.js";
import {
  processPeriods,
  processHours,
  groupDates,
} from "../middleWare/process.js";

export const createBooking = async (req, res) => {
  try {
    let { tool_id, date, time, duration, userInfo } = req.body;
    if (!date || !time || !duration || !userInfo) {
      return res.status(400).json({ msg: "Please complete all fields" });
    }
    //check if selected date is valid
    if (new Date(date).setHours(23, 59, 59, 59) < new Date()) {
      return res.status(400).json({ msg: "Booking date can't be in the past" });
    }

    //check if all required questions are answered
    let allFilled = true;
    userInfo.map((a) => {
      if (!a.answer && a.required) {
        allFilled = false;
      }
    });
    if (!allFilled) {
      return res.status(400).json({ msg: "Please enter all required fields" });
    }

    //check if a valid email is entered
    if (
      !userInfo[1].answer.includes("@") ||
      !userInfo[1].answer.includes(".")
    ) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    let lastAtPos = userInfo[1].answer.lastIndexOf("@");
    let lastDotPos = userInfo[1].answer.lastIndexOf(".");

    if (lastAtPos > lastDotPos) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    //check if a valid phone number is enetered
    if (userInfo[2].answer.match(/^[0-9]+$/) === null) {
      return res.status(400).json({ msg: "please enter a valid phone number" });
    }

    //increment number of bookings in the calendar
    const query = { _id: tool_id };
    const tool = await Tool.findOneAndUpdate(
      query,
      { $inc: { bookings: 1 } },
      { new: true }
    );

    //create the booking
    const newBooking = new Booking({
      user_id: tool.user_id,
      calendar: tool.name,
      date,
      time,
      duration,
      userInfo,
    });
    const savedBooking = await newBooking.save();

    //return booking
    res.json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//deliver user's calendar based on their availibility
export const getCalendar = async (req, res) => {
  try {
    let { id } = req.body;
    if (!id) return res.status(400).json({ msg: "ambiguous calendar request" });
    if (!id.match(/^[0-9a-fA-F]{24}$/))
      return res.status(400).json({ msg: "calendar id is not valid" });
    let tool = await Tool.findById(id);
    if (!tool) return res.status(400).json({ msg: "calendar does not exist" });

    //transform user's inputted availibility to more explicit data
    tool.periods = processPeriods(tool.periods);
    tool.hours = groupDates(tool.hours);
    tool.hours = processHours(tool.hours[0]);

    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { booking } = req.body;
    //decrement number of bookings in user's calendar
    const theBooking = await Booking.findById(booking);
    const query = { name: theBooking.calendar };
    await Tool.findOneAndUpdate(
      query,
      { $inc: { bookings: -1 } },
      { new: true }
    );

    //delete booking
    const deletedBooking = await Booking.findByIdAndDelete(booking);

    res.json(deletedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { user_id } = req.body;
    const allBookings = await Booking.find();

    //loop through all bookings and extract user's
    let userBookings = await Promise.all(
      allBookings.map(async (booking) => {
        if (booking.user_id === user_id) return booking;
      })
    );

    res.json(userBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNumber = async (req, res) => {
  try {
    const { user_id } = req.body;
    const query = await Booking.find();
    let counter = 0;

    //loop through all bookings and count the ones with the user's id
    for (let i in query) {
      if (query[i].user_id === user_id) {
        counter += 1;
      }
    }

    return res.json({ number: counter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const { id } = req.body;
    const booking = await Booking.findById(id);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
