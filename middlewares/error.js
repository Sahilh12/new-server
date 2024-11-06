class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}


errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server error"        
    err.statusCode = err.statusCode || 500

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
    }
    if (err.name === "JsonWebTokenError") {
        const message = "JsonWebToken is invalid, Please try again"
        err = new ErrorHandler(message, 400)
    }
    if (err.name === "TokenExpiredError") {
        const message = `JsonWebToken is expired, Please try again`
        err = new ErrorHandler(message, 400)
    }
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    }
    console.log("error from middleware : ", err)

    const errorMessage = err.errors ? Object.values(err.errors).map((error) => error.message).join(" ") : err.message

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage
    })

}

module.exports = { errorMiddleware, ErrorHandler }