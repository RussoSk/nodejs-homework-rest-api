const { User } = require("../models/schemas/user");

const register = async (body) => {
  const result = await User.create(body);
  return result;
};

const login = async (body) => {
  const user = await User.findOne({ email: body.email });
  return user || null;
};

const logout = async (id) => {
  await User.findByIdAndUpdate(id, {token: ""})
}

const findUser = async (id) => {
  const user = await User.findById(id);
  return user || null;
};

const updateToken = async (id, token) => {
  await User.findByIdAndUpdate(id, { token });
};

const updateUserAvatar = async (id, avatar) => {
  await User.findByIdAndUpdate(id, { avatarURL: avatar });
};

module.exports = {
  register,
  login,
  logout,
  findUser,
  updateToken,
  updateUserAvatar,
};