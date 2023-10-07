const { HttpError } = require("../utils");
const jwt = require("jsonwebtoken");
const { findUser } = require("../service/auth");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  const {SECRET_KEY} = process.env;
  const {authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  try {
    const {id} = jwt.verify(token, SECRET_KEY);
    const user = await findUser(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "User not found"));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401, "Unauthorized"));
  }
};

module.exports = authenticate;