class CustomError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
    this.custom = true;
  }
}

module.exports = CustomError;