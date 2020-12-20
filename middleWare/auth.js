import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res
        .status(401)
        .json({ msg: "No token provided : autorization denied" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res
        .status(401)
        .json({ msg: "Token verification failed : autorization denied" });
    }

    req.user = verified.id;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default auth;
