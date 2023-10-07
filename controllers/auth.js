const bcrypt = require("bcrypt");

const { validateData } = require("../utils/validateData");
const { register, login, updateToken, logout } = require("../service/auth");
const createToken = require("../utils/jwt");

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    validateData.validateUser(res, req.body);

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await register({
      email: email.trim(),
      password: hashPassword,
    });

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

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    validateData.validateUser(res, req.body);

    const user = await login(req.body);
    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
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

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  logoutUser,
};