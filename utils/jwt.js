const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (id) => {
  const { SECRET_KEY } = process.env;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  return token;
  
  
};

const token = createToken(); 

console.log("Отриманий токен:", token);

module.exports = createToken;