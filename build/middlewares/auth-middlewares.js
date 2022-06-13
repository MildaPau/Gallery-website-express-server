"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.userMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = __importDefault(require("../models/user-model"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (authHeader === undefined)
            throw new Error('Reikalingas prisijungimas');
        const token = authHeader.split(' ')[1];
        if (token === undefined)
            throw new Error('Klaidingi vartotojo atpažinimo duomenys');
        const decodedInfo = jsonwebtoken_1.default.verify(token, config_1.default.token.secret);
        req.tokenData = {
            email: decodedInfo.email,
            role: decodedInfo.role,
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            error: error instanceof Error ? error.message : 'Klaida atpažįstant vartotoją',
        });
    }
};
exports.authMiddleware = authMiddleware;
const userMiddleware = async (req, res, next) => {
    if (req.tokenData === undefined) {
        res.status(401).json({
            error: 'Reikalingas Prisijungimas',
        });
        return;
    }
    const authUser = await user_model_1.default.findOne({ email: req.tokenData.email });
    if (authUser === null) {
        res.status(404).json({
            error: 'Autentifikuojamas vartotojas nerastas',
        });
        return;
    }
    req.authUser = authUser;
    next();
};
exports.userMiddleware = userMiddleware;
const adminMiddleware = async (req, res, next) => {
    if (req.tokenData === undefined) {
        res.status(401).json({
            error: 'Reikalingas Prisijungimas',
        });
        return;
    }
    if (req.tokenData.role !== 'admin') {
        res.status(401).json({
            error: 'Veiksmas leidžiamas tik adminui',
        });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
