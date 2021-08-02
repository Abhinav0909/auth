import database from "../../loaders/database";
import { LogIn, SignUp } from './models'
import * as bcrypt from 'bcrypt'
import config from "../../config";
import * as jwt from "jsonwebtoken";
import LoggerInstance from "../../loaders/logger";
import { ObjectId } from "mongodb";
import mail from "../../common/mailgun";
import body from "../../common/mail/body";
export const signUpController = async (user: SignUp):Promise<boolean> => {
  const data = await (await database()).collection('users').find({ email: user.email }).toArray();
  LoggerInstance.info(data);
  if (data.length === 0) {
    const salts = bcrypt.genSaltSync(config.saltRounds);
    const hashedPassword = bcrypt.hashSync(user.password,salts);
    user.password = hashedPassword;
    await (await database()).collection('users').insertOne(user);
    await mail(user.email,'Account generated',body(user.email))
    return true; 
  }
  else{
    return false;
  }
}

export const logInController = async (user: LogIn): Promise<string> => {
  const data:{_id:ObjectId,name:string,password:string,email:string} = await (await database()).collection('users').findOne({email:user.email});
  if (data === null) {
    return null;
  }
  else {
    return bcrypt.compareSync(user.password, data.password)?jwt.sign({id:data._id},config.jwtSecret):null;
  }
}

export const getProfile = async (token: string): Promise<SignUp> => {
  try {
    const data: { id: ObjectId } = jwt.verify(token, config.jwtSecret) as {id:ObjectId};
    const user = await (await database()).collection('users').findOne({ _id: new ObjectId(data.id) });
    delete user.password;
    return user;
  } catch (e) {
    LoggerInstance.error(e);
    return null;
  }
}