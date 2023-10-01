const errorMessageList = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict"
};

const HttpError = (condition, status, message = errorMessageList[status]) => {
    if (condition) {
      const error = new Error(message);
      error.status = status;
      throw error;
    }
  };
  
  module.exports = HttpError;