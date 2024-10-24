const nodemailer = require("nodemailer")


module.exports.sendEmail = async (options) => {

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            service:"gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: options.email,
            subject: options.subject,
            text: options.message
        }

        await transporter.sendMail(mailOptions)

    } catch (err) {
        return err.message
    }
    
}