const jwt = require("jsonwebtoken");
const { catchAsyncError } = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/error");

module.exports.isAuthMiddleware = catchAsyncError((req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new ErrorHandler("You are not Authenticated!", 400))
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decode.id
    next()
})