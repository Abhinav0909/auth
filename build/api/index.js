"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router_1 = __importDefault(require("./auth/router"));
const router_2 = __importDefault(require("./otp/router"));
exports.default = () => {
    const app = express_1.Router();
    //TODO: add routes here...
    app.use('/auth', router_1.default);
    app.use('/otp', router_2.default);
    return app;
};
//# sourceMappingURL=index.js.map