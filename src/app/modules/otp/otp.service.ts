import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
const OTP_EXPIRATION = 2 * 60 // 2minute


const generateOTP = (length = 6) => {
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()
    return otp
}

const sendOTP = async (email: string, name: string) => {
    const otp = generateOTP()
    const redisKey = `otp:${email}`

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: 'Your OTP Code',
        templateName: 'otp',
        templateData: {
            name: name,
            otp: otp
        }
    })
};

// Verify OTP
const verifyOTP = async (email: string, otp: string) => {
    const redisKey = `otp:${email}`
    const saveOtp = await redisClient.get(redisKey)

    if (!saveOtp) {
        throw new AppError(404, 'OTP not found')
    }

    if (saveOtp != otp) {
        throw new AppError(401, 'Invalid OTP')
    }

    await Promise.all([
        await User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        await redisClient.del([redisKey])
    ])

};

export const OTPService = {
    sendOTP,
    verifyOTP
}