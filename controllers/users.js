import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    let { name, email, password, passwordCheck } = req.body;

    if (!name || !email || !password || !passwordCheck) {
      return res.status(400).json({ msg: "not all fields have been entered" });
    }

    //check if submitted email is valid
    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    let lastAtPos = email.lastIndexOf("@");
    let lastDotPos = email.lastIndexOf(".");

    if (lastAtPos > lastDotPos) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    //check if the password is too short
    if (password.length < 5) {
      return res.status(400).json({ msg: "password too short" });
    }

    //check if the passwords match
    if (password !== passwordCheck) {
      return res.status(400).json({ msg: "passwords don't match" });
    }

    //check if a user with the submitted email already exist
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "Account with this email already exists" });
    }

    //incrypt the user's password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //register the user
    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please enter your password and email" });
    }

    //check if the email matches one of the users'
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "An account with this email does not exist" });
    }

    //check if the password macthes the email
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "invalid password" });
    }

    //create a JWT token and return the user's data
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const validateToken = async (req, res) => {
  try {
    //get the token
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    //check if the token is valid
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    //check if the user exists
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    name: user.name,
    id: user._id,
  });
};
