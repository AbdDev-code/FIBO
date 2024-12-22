const nodemailer = require('nodemailer');
const otpModel = require('../models/otp.model');
require('dotenv').config()
class MailService{
    constructor(){
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

    async sendOtp(email){
        const otp = Math.floor(100000 + Math.random()*900000)
        await otpModel.create({email,otp})
        console.log(otp)
         await this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to:email,
            subject:`OTP for verification PIZZA web site ${new Date().toLocaleString()}`,
            html:`
                <h1>Your OTP is ${otp}</h1>
            `
         })
    }

    async verifyOtp(to,subject,text){

    }
}


module.exports = new MailService