const express = require("express")

const authRouter = express.Router()

const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  updateAvatar,

} = require("../controllers/auth");

const { authenticate, upload} = require("../middlewares");

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

authRouter.post("/logout", authenticate, logoutUser);

authRouter.get("/current", authenticate, currentUser);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = authRouter;