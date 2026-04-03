class apiResponse {
      constructor(statusCode, data, message="success") {
            this.data = data;
            this.message = message;
            this.statusCode = statusCode
      }
}

module.exports = apiResponse