import database from "../../loaders/database";
import { CheckResult, otpParameters,CheckOtp } from "./models";
import { customAlphabet } from "nanoid";
import mail from "../../common/mailgun";
import LoggerInstance from "../../loaders/logger";
import otp from '../../common/mail/otp';
import * as bcrypt from 'bcrypt';
import config from "../../config";

const nanoid = customAlphabet('1234567890', 4);
export const otpController = async (user: otpParameters): Promise<string> => {
  try {
    const data = await (await database()).collection('users').findOne({ email: user.email });
    if (data === null) {
      return 'Check your email again';
    }
    else {
      const otpCreator = await (await database()).collection('otp').findOne({ email: user.email });
      if (otpCreator !== null) {
        await (await database()).collection('otp').findOneAndDelete({email:user.email })
      }
      else {
        const otpCreated = nanoid();
        await (await database()).collection('otp').insertOne({ otp: otpCreated, email: user.email, expireAt: new Date() })
        mail(user.email, 'OTP Request', otp(user.email, otpCreated));
        return 'Successful'
      }
    }
  } catch(e)
  {
    LoggerInstance.info(e);
    return 'Something went wrong';
   }
}

//for otp checking

export const checkController = async (user: CheckOtp): Promise<CheckResult> => {
  try {
    const data = await(await database()).collection('otp').findOne({ email: user.email });
    if (data === null) {
      return {
        status: 404,
        message: 'Otp not rfound!.Create a new one',
      }
    }
    else {
      if (data.otp !== user.otp) {
        return {
          status: 404,
          message: 'Otp does not match'
        }
      } else {
        const salt = bcrypt.genSaltSync(config.saltRounds);
        const hashedPassword = bcrypt.hashSync(user.newPassword, salt);
        await (await database()).collection('user').findOneAndUpdate({ email: user.email }, { $set: { password: hashedPassword } });
        await (await database()).collection('otp').findOneAndDelete({ email: user.email });
        return {
          status: 200,
          message: 'Password has successfully changed',
        }

      }
    }
  } catch (e) {
    return {
      status: 500,
      message: 'An error occured',
    }
  }
}
