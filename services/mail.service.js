const ErrorResponse = require('../utils/errorResponse')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const otpModel = require('../models/otp.model')
const nodemailer = require('nodemailer')

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })
    }

    async sendOtp(to) {
        try {
            const otp = crypto.randomInt(1000, 9999)
            console.log(`Generated OTP: ${otp}`)
            const hashedOtp = await bcrypt.hash(otp.toString(), 10)
            const existingOtp = await otpModel.findOne({ email: to })
            if (existingOtp) {
                await otpModel.deleteMany({ email: to })
            }
    
            await otpModel.create({
                email: to,
                otp: hashedOtp,
                expireAt: new Date(Date.now() + 10 * 60 * 1000)
            })
    
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: `Verify your account: ${new Date().toLocaleString()}`,
                html: `<h1>OTP to verify your account: ${otp}</h1>`
            })
            return true;
        } catch (err) {
            console.error('Error sending OTP:', err);
            throw new ErrorResponse('Failed to send OTP. Please try again.', 400)
        }
    }    

    async verifyOtp(email, otp) {
        try {
            const otpData = await otpModel.findOne({ email })
            if (!otpData) {
                return {
                    success: false,
                    message: 'OTP not found'
                }
            }

            if (otpData.expireAt < new Date()) {
                await otpModel.deleteMany({ email })
                await this.sendOtp(email)
                return {
                    success: false,
                    message: "OTP has expired. A new OTP has been sent."
                }
            }

            const isValid = await bcrypt.compare(otp.toString(), otpData.otp)
            if (!isValid) {
                return {
                    success: false,
                    message: "Invalid OTP entered."
                }
            }

            await otpModel.deleteMany({ email })
            return {
                success: true,
                message: "OTP verified successfully."
            }
        } catch (err) {
            console.error('Error verifying OTP:', err)
            throw new ErrorResponse('Error verifying OTP. Please try again later.', 500)
        }
    }
}

module.exports = new MailService()
