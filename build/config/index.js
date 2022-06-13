"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '.env') });
const { DB_CONNECTION_URL, TOKEN_SECRET } = process.env;
if (DB_CONNECTION_URL === undefined || TOKEN_SECRET === undefined) {
    throw new Error('Please set up variables in src/config/.env file');
}
const config = {
    token: {
        secret: TOKEN_SECRET,
    },
    db: {
        connectionUrl: DB_CONNECTION_URL,
    },
};
exports.default = config;
