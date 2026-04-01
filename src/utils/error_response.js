function errorResponse(message,error){
      return {
            success: false,
            message: message,
            data: {},
            error: error
      }
}

module.exports = {
      errorResponse
}