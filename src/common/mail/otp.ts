 import doT from 'dot';
import * as fs from 'fs';
import path from 'path';
export default (email:string,otp:string): string => {
  const data = fs.readFileSync(path.join(__dirname, '/../../../template/otp.html'), 'utf-8');
  const template = doT.template(data);
  return template({email: email,otp:otp})
};