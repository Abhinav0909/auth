"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../../loaders/logger"));
const controller_1 = require("./controller");
const authRouter = express_1.Router();
const SignUpHandler = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(6).max(12).required(),
        });
        const { value, error } = schema.validate(req.body);
        if (error) {
            logger_1.default.error(error);
            throw {
                status: 422,
                message: 'Validation Error',
            };
        }
        else {
            controller_1.signUpController(value).then((val) => {
                if (val === true) {
                    res.status(201).json({
                        message: 'User created',
                    });
                }
                else {
                    res.status(403).json({
                        message: 'User already exists',
                    });
                }
            });
        }
    }
    catch (err) {
        res.status(err.status || 500).json({
            message: err.message || 'An error occured',
        });
    }
};
const logInHandler = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(6).max(12).required(),
        });
        const { value, error } = schema.validate(req.body);
        if (error) {
            throw {
                status: 422,
                message: 'Validation Error',
            };
        }
        else {
            controller_1.logInController(value).then((val) => {
                if (val !== null) {
                    res.status(201).json({
                        message: 'LogIn Successful',
                        token: val,
                    });
                }
                else {
                    res.status(403).json(({
                        message: 'Login failed'
                    }));
                }
            });
        }
    }
    catch (err) {
        res.status(err.status || 500).json({
            message: err.message || 'An error occured',
        });
    }
};
const getProfileByToken = async (req, res) => {
    try {
        if (req.headers.authorization.length === 0) {
            throw {
                status: 401,
                message: 'Access is not authorised',
            };
        }
        else {
            const token = req.headers.authorization.substring(7);
            controller_1.getProfile(token).then((val) => {
                if (val === null) {
                    throw {
                        status: 401,
                        message: 'Access is not authorised'
                    };
                }
                else {
                    res.status(200).json({
                        message: 'Profile found',
                        profile: val,
                    });
                }
            })
                .catch(e => {
                logger_1.default.error(e);
            });
        }
    }
    catch (e) {
        res.status(e.status || 500).json({
            message: e.message || 'An error occured',
        });
    }
};
authRouter.post('/signUp', SignUpHandler);
authRouter.post('/login', logInHandler);
authRouter.post('/getprofile', getProfileByToken);
exports.default = authRouter;
//# sourceMappingURL=router.js.map