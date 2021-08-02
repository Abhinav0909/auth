import { Router } from 'express';
import authRouter from './auth/router';
import otpRoute from './otp/router';
export default (): Router => {
  const app = Router();

  //TODO: add routes here...
  app.use('/auth', authRouter);
  app.use('/otp', otpRoute);
  return app;
};
