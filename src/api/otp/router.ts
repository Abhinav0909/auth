import { Router, Request, Response } from "express";
import Joi from "joi";
import { checkController, otpController } from "./controller";

const otpRoute = Router();
const otpGenerator = async(req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    })
    const { value, error } = schema.validate(req.body);
    if (error) {
      throw {
        status: 422,
        message:"Validation Error",
      }
    }
    else {
      otpController(value).then((val) => {
        if (val === 'Successful') {
          res.status(201).json({
            message:val,
          })
        }
        else {
          res.status(403).json({
            message:val,
          })
        }
      })
    }
  } catch (err) {
    res.status(err.status || 500).json({
      message:err.message || "An error occured",
    })
  }
}

const otpVerification = async(req:Request,res:Response) =>{
  try{
    const schema = Joi.object({
      email: Joi.string().email().required(),
      otp: Joi.string().required(),
      newPassword:Joi.string().min(6).max(12).required(),
    })
    const { value, error } = schema.validate(req.body);
    if (error) {
      throw {
        status: 422,
        message:'Validation Error',
      }
    } else {
      checkController(value).then((val) => {
    res.status(val.status).json({
          message:val.message,
        })
      })
    }
  }catch (err) {
    res.status(err.status || 500).json({
      message:err.message || 'An error occured',
    })
  }
}
otpRoute.post('/otp', otpGenerator);
otpRoute.post('/checkOtp', otpVerification);
export default otpRoute;

