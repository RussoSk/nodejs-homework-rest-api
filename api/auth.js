const express = require("express")

const authRouter = express.Router()

const {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail

} = require("../controllers/auth");

const { authenticate, upload} = require("../middlewares");

authRouter.post("/register", registerUser);

authRouter.get("/verify/:verificationCode", verifyEmail);

authRouter.post("/verify", resendVerificationEmail);

authRouter.post("/login", loginUser);

authRouter.post("/logout", authenticate, logoutUser);

authRouter.get("/current", authenticate, currentUser);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = authRouter;