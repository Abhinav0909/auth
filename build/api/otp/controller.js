"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkController = exports.otpController = void 0;
const database_1 = __importDefault(require("../../loaders/database"));
const nanoid_1 = require("nanoid");
const mailgun_1 = __importDefault(require("../../common/mailgun"));
const logger_1 = __importDefault(require("../../loaders/logger"));
const otp_1 = __importDefault(require("../../common/mail/otp"));
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const nanoid = nanoid_1.customAlphabet('1234567890', 4);
const otpController = async (user) => {
    try {
        const data = await (await database_1.default()).collection('users').findOne({ email: user.email });
        if (data === null) {
            return 'Check your email again';
        }
        else {
            const otpCreator = await (await database_1.default()).collection('otp').findOne({ email: user.email });
            if (otpCreator !== null) {
                await (await database_1.default()).collection('otp').findOneAndDelete({ email: user.email });
            }
            else {
                const otpCreated = nanoid();
                await (await database_1.default()).collection('otp').insertOne({ otp: otpCreated, email: user.email, expireAt: new Date() });
                mailgun_1.default(user.email, 'OTP Request', otp_1.default(user.email, otpCreated));
                return 'Successful';
            }
        }
    }
    catch (e) {
        logger_1.default.info(e);
        return 'Something went wrong';
    }
};
exports.otpController = otpController;
//for otp checking
const checkController = async (user) => {
    try {
        const data = await (await database_1.default()).collection('otp').findOne({ email: user.email });
        if (data === null) {
            return {
                status: 404,
                message: 'Otp not rfound!.Create a new one',
            };
        }
        else {
            if (data.otp !== user.otp) {
                return {
                    status: 404,
                    message: 'Otp does not match'
                };
            }
            else {
                const salt = bcrypt.genSaltSync(config_1.default.saltRounds);
                const hashedPassword = bcrypt.hashSync(user.newPassword, salt);
                await (await database_1.default()).collection('user').findOneAndUpdate({ email: user.email }, { $set: { password: hashedPassword } });
                await (await database_1.default()).collection('otp').findOneAndDelete({ email: user.email });
                return {
                    status: 200,
                    message: 'Password has successfully changed',
                };
            }
        }
    }
    catch (e) {
        return {
            status: 500,
            message: 'An error occured',
        };
    }
};
exports.checkController = checkController;
//# sourceMappingURL=controller.js.map