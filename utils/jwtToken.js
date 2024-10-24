module.exports.jwtToken = async (user, message, statusCode, res) => {
    const token = await user.generateJsonWebToken()

    res
        .status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        })
        .json({
            success: true,
            token,
            message,
            user,
        });

}