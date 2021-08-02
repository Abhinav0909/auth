import {Request,Router,Response} from 'express';
import Joi from 'joi';
import LoggerInstance from '../../loaders/logger';
import {signUpController,logInController, getProfile} from './controller'
const authRouter = Router();

const SignUpHandler = async(req:Request,res:Response) => {
  try{
    const schema = Joi.object({
      name:Joi.string().required(),
      email:Joi.string().email().required(),
      password:Joi.string().min(6).max(12).required(),
    })
    const {value,error} = schema.validate(req.body);
    if (error) {
      LoggerInstance.error(error);
      throw{
        status:422,
        message:'Validation Error',
      }
    }
    else{
      signUpController(value).then((val)=>{
        if(val === true){
        res.status(201).json({
          message:'User created',
        })
        }
        else{
          res.status(403).json({
            message:'User already exists',
          })
        }
      })
    }
  }
  catch(err){
    res.status(err.status || 500).json({
      message:err.message || 'An error occured',
    })
  }
}

const logInHandler = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password:Joi.string().min(6).max(12).required(),
    })
    const { value, error } = schema.validate(req.body);
    if (error) {
      throw {
        status: 422,
        message: 'Validation Error',
      }
    }
    else {
      logInController(value).then((val) => {
        if (val !== null) {
          res.status(201).json({
            message: 'LogIn Successful',
            token:val,
          })
        }
        else {
          res.status(403).json(({
            message:'Login failed'
          }))
        }
      })
    }
  }
  catch (err) {
    res.status(err.status || 500).json({
      message:err.message || 'An error occured',
    })
 } 
}

const getProfileByToken = async (req: Request, res: Response) => {
  try {
    if (req.headers.authorization.length === 0) {
      throw {
        status: 401,
        message:'Access is not authorised',
      }
    }
    else {
      const token = req.headers.authorization.substring(7);
      getProfile(token).then((val) => {
        if (val === null) {
          throw {
            status: 401,
            message:'Access is not authorised'
          }
        } else {
          res.status(200).json({
            message: 'Profile found',
            profile:val,
          })
  }
      })
        .catch(e => {
          LoggerInstance.error(e)
        })
    }
  }
  catch (e) {
    res.status(e.status || 500).json({
    message: e.message || 'An error occured',
  })
  }
}
authRouter.post('/signUp',SignUpHandler);
authRouter.post('/login', logInHandler);
authRouter.post('/getprofile', getProfileByToken);
export default authRouter;

