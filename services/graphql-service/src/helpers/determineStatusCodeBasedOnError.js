const determineStatusCodeBasedOnError = (error) => {
  switch (error.message) {
    case "Unauthorized":
      return 401;

    case "Not Found":
      return 404;

    case "Duplicate Email":
      return 409;

    case "Validation Erroe":
      return 403;

    case "Invalid Email or Password":
      return 401;

    case "Invalid Refresh Token":
      return 422;

    default:
      return 500;
  }
};

module.exports = determineStatusCodeBasedOnError;
