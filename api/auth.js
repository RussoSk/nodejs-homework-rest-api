const express = require("express")

const authRouter = express.Router()

const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
} = require("../controllers/auth");
const { authenticate } = require("../middlewares");

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

authRouter.post("/logout", authenticate, logoutUser);

authRouter.get("/current", authenticate, currentUser);

module.exports = authRouter;