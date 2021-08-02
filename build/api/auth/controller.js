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
exports.getProfile = exports.logInController = exports.signUpController = void 0;
const database_1 = __importDefault(require("../../loaders/database"));
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const jwt = __importStar(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../../loaders/logger"));
const mongodb_1 = require("mongodb");
const mailgun_1 = __importDefault(require("../../common/mailgun"));
const body_1 = __importDefault(require("../../common/mail/body"));
const signUpController = async (user) => {
    const data = await (await database_1.default()).collection('users').find({ email: user.email }).toArray();
    logger_1.default.info(data);
    if (data.length === 0) {
        const salts = bcrypt.genSaltSync(config_1.default.saltRounds);
        const hashedPassword = bcrypt.hashSync(user.password, salts);
        user.password = hashedPassword;
        await (await database_1.default()).collection('users').insertOne(user);
        await mailgun_1.default(user.email, 'Account generated', body_1.default(user.email));
        return true;
    }
    else {
        return false;
    }
};
exports.signUpController = signUpController;
const logInController = async (user) => {
    const data = await (await database_1.default()).collection('users').findOne({ email: user.email });
    if (data === null) {
        return null;
    }
    else {
        return bcrypt.compareSync(user.password, data.password) ? jwt.sign({ id: data._id }, config_1.default.jwtSecret) : null;
    }
};
exports.logInController = logInController;
const getProfile = async (token) => {
    try {
        const data = jwt.verify(token, config_1.default.jwtSecret);
        const user = await (await database_1.default()).collection('users').findOne({ _id: new mongodb_1.ObjectId(data.id) });
        delete user.password;
        return user;
    }
    catch (e) {
        logger_1.default.error(e);
        return null;
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=controller.js.map