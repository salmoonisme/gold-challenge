class Response {
  constructor(res, status, data) {
    return res.status(status).json({
      status: "Success",
      data: data,
    });
  }
}

class Error {
  constructor(status, error) {
    this.status = status;
    this.error = error;
    this.data = {}
  }
}

module.exports = { Response, Error };
