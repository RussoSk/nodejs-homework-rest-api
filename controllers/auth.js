const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const {nanoid} = require("nanoid")
const User = require("../models/schemas/user");

const { validateData } = require("../utils/validateData");
const { register, login, updateToken, logout, updateUserAvatar, verifycateEmail} = require("../service/auth");
const createToken = require("../utils/jwt");
const resizeAvatar = require("../utils/resizeAvatar.js");
const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const {sendEmail} = require ("../utils/sendEmail");
const { HttpError } = require("../utils");

const {BASE_URL} = process.env;

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    validateData.validateUser(res, req.body);

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationCode = nanoid();
    const newUser = await register({
      email: email.trim(),
      password: hashPassword,
      avatarURL,
      verificationCode,
    });

    const verifyEmail = {
      to: email,subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}>Click verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoServerError") {
      return res.status(409).json({ message: "Email in use" });
    }
  }
};



const verifyEmail = async (req, res, next) => {
  try {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });

    if (!user) {
      throw HttpError(401, "Email not found");
    }

    await verifycateEmail(user._id);

    res.json({ message: "Email verified" });
  } catch (e) {
    next(e);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}>Click verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.json({ message: "Verification email sent" });
  } catch (e) {
    next(e);
  }
};



const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    validateData.validateUser(res, req.body);

    const user = await login(req.body);
    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (!user.verify) {
      return res.status(401).json({ message: "Email not user verified" });
    }

    if (!passwordCompare) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = createToken(user._id);

    await updateToken(user._id, token);

    res.json({
      token: token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (e) {
  }
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await logout(_id);
  return res.status(204).end();
};

const currentUser = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    await resizeAvatar(tempUpload);
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, fileName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", fileName);
    await updateUserAvatar(_id, avatarURL);
    res.json({ avatarURL });
  } catch (e) {
    res.status(400).json({ message: "No files" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
};