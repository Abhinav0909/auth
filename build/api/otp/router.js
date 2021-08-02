"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const controller_1 = require("./controller");
const otpRoute = express_1.Router();
const otpGenerator = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
        });
        const { value, error } = schema.validate(req.body);
        if (error) {
            throw {
                status: 422,
                message: "Validation Error",
            };
        }
        else {
            controller_1.otpController(value).then((val) => {
                if (val === 'Successful') {
                    res.status(201).json({
                        message: val,
                    });
                }
                else {
                    res.status(403).json({
                        message: val,
                    });
                }
            });
        }
    }
    catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "An error occured",
        });
    }
};
const otpVerification = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            otp: joi_1.default.string().required(),
            newPassword: joi_1.default.string().min(6).max(12).required(),
        });
        const { value, error } = schema.validate(req.body);
        if (error) {
            throw {
                status: 422,
                message: 'Validation Error',
            };
        }
        else {
            controller_1.checkController(value).then((val) => {
                res.status(val.status).json({
                    message: val.message,
                });
            });
        }
    }
    catch (err) {
        res.status(err.status || 500).json({
            message: err.message || 'An error occured',
        });
    }
};
otpRoute.post('/otp', otpGenerator);
otpRoute.post('/checkOtp', otpVerification);
exports.default = otpRoute;
//# sourceMappingURL=router.js.map