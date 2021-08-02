import { NodeMailgun } from 'ts-mailgun';
import { receiveMessageOnPort } from 'worker_threads';
import config from '../config';
import LoggerInstance from '../loaders/logger';

const mailGun = new NodeMailgun();
mailGun.apiKey = config.apiKey;
mailGun.domain = config.domain;
mailGun.fromEmail = `hi@${config.domain}`;
mailGun.fromTitle = 'You have successfully signed up';
mailGun.init();

const mail = async(receiver:string,subject:string,content:string):Promise<void> =>{
  const data = await mailGun.send(receiver, subject, content).catch(error => {
      LoggerInstance.error(error);
    });
  LoggerInstance.info(data);
};

export default mail;
