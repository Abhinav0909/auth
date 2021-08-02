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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
exports.default = {
    /**
     * Port the app should run on
     */
    port: parseInt(process.env.PORT) || 5050,
    /**
     * Database the app should connect to
     */
    databaseURL: process.env.MONGODB_URI,
    /**
     * The secret sauce to validate JWT
     */
    jwtSecret: process.env.JWT_SECRET,
    saltRounds: parseInt(process.env.SALT_ROUNDS),
    /**
     * Used by Winston logger
     */
    /**
     * The secret key of mailgun
     */
    apiKey: process.env.API_KEY,
    /**
       * The domain name of sandbox
       */
    domain: process.env.DOMAIN,
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },
};
//# sourceMappingURL=index.js.map