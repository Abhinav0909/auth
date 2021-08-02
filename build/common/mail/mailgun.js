"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mailgun_1 = require("ts-mailgun");
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../loaders/logger"));
const mailGun = new ts_mailgun_1.NodeMailgun();
mailGun.apiKey = config_1.default.apiKey;
mailGun.domain = config_1.default.domain;
mailGun.fromEmail = `hi@${config_1.default.domain}`;
mailGun.fromTitle = 'You have successfully signed up';
mailGun.init;
const mail = async (receiver, content, subject) => {
    const data = await mailGun.send(receiver, subject, content).catch(error => {
        logger_1.default.error(error);
    });
    logger_1.default.info(data);
};
exports.default = mail;
//# sourceMappingURL=mailgun.js.map