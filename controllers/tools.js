import Tool from "../models/Tool.js";
import { processDurations, groupDates } from "../middleWare/process.js";

export const createTool = async (req, res) => {
  try {
    let {
      tool_id,
      username,
      user_id,
      name,
      durations,
      periods,
      hours,
      questions,
    } = req.body;

    if (!username || !name || !durations || !periods || !hours || !questions) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    //make the inputted durations more explicit
    durations = processDurations(durations);

    //check if the durations submitted is valid
    if (durations.some((item) => item <= 0)) {
      return res
        .status(400)
        .json({ msg: "Please enter valid durations for the meeting" });
    }

    //check the validity of dates submitted
    if (
      periods.some((item) => item.start > item.end || item.start < new Date())
    ) {
      return res
        .status(400)
        .json({ msg: "Please enter valid dates for your availibility" });
    }

    //check if a calendar with the same name alreay exists
    const existingTool = await Tool.findOne({ name: name, user_id: user_id });
    if (existingTool && !tool_id) {
      return res
        .status(400)
        .json({ msg: "A tool with this name already exists" });
    }

    //in case a calendar ID is submitted edit the existing one
    if (tool_id) {
      const toUpdate = await Tool.findById(tool_id);
      let updated = await Tool.findByIdAndUpdate(
        { _id: tool_id },
        {
          username: username,
          user_id: user_id,
          name: name,
          durations: durations,
          periods: periods,
          hours: hours,
          questions: questions,
          bookings: toUpdate.bookings,
          status: toUpdate.status,
        }
      );
      return res.json(updated);
    }

    //create a new calendar with the submitted data
    const newTool = new Tool({
      username,
      user_id,
      name,
      durations,
      periods,
      hours,
      questions,
    });

    const savedTool = await newTool.save();
    res.json(savedTool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTool = async (req, res) => {
  try {
    const { tool } = req.body;
    const deletedTool = await Tool.findByIdAndDelete(tool);
    res.json(deletedTool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTool = async (req, res) => {
  try {
    const { id, editing } = req.body;
    const tool = await Tool.findById(id);

    //only process durations data if not editing
    if (!editing) tool.hours = groupDates(tool.hours);

    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTools = async (req, res) => {
  try {
    const { user_id } = req.body;

    //get all calendars with the user's ID
    const allTools = await Tool.find({
      user_id: user_id,
    });

    res.json(allTools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNumber = async (req, res) => {
  try {
    const { user_id } = req.body;
    const query = await Tool.find({ user_id: user_id });

    //if no calendar with the user's ID exist return 0
    if (!query) return res.json({ number: 0 });

    //return the number of calendars created by the user
    let counter = query.length;
    return res.json({ number: counter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { tool_id, newStatus } = req.body;
    const query = { _id: tool_id };

    //update the status of a calendar based on its previous
    const updated = await Tool.findByIdAndUpdate(
      query,
      { $set: { status: newStatus } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
