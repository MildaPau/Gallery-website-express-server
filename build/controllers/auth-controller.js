"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user-model"));
const config_1 = __importDefault(require("../config"));
/*
  RequestHandler
    * params - tai ką nurodote route'e, pvz.: '/:id'
    * res.body - tai ką išsiunčiate(mūsų atveju tai ką siunčiate req.json(<TIPAS>))
    * req.body - tai ką gaunate į req.body savybę
    * req.query - tai ką perduodame url, pvz.: "/user?sort=name&page=2&limit=14"

  Jeigu norite perduoti 3 parametrą, bet nereikia perduoti 1 ir 2, tuomet galite naudoti tipą
  <unknown>, kad praleisti 1 ir 2 bendrinių parametrų nurodymus.
*/
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email)
            throw new mongoose_1.Error('Privalomas el. paštas');
        if (!password)
            throw new mongoose_1.Error('Privalomas slaptažodis');
        const user = await user_model_1.default.findOne({ email });
        if (user === null)
            throw new mongoose_1.Error(`Vartotojas su paštu '${email}' nerastas`);
        const passwordIsCorrect = bcrypt_1.default.compareSync(password, user.password);
        if (!passwordIsCorrect)
            throw new mongoose_1.Error('Slaptažodis neteisingas');
        const token = jsonwebtoken_1.default.sign({ email, role: user.role }, config_1.default.token.secret);
        res.status(200).json({
            user,
            token: `Bearer ${token}`,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof mongoose_1.Error ? error.message : 'Serverio klaida prisijungiant',
        });
    }
};
exports.login = login;
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email)
            throw new mongoose_1.Error('Privalomas el. paštas');
        if (!password)
            throw new mongoose_1.Error('Privalomas slaptažodis');
        const hashedPassword = bcrypt_1.default.hashSync(password, 5);
        const createdUser = await user_model_1.default.create({ email, password: hashedPassword });
        const token = jsonwebtoken_1.default.sign({ email, role: createdUser.role }, config_1.default.token.secret);
        res.status(201).json({
            user: createdUser,
            token: `Bearer ${token}`,
        });
    }
    catch (error) {
        let message;
        if (error instanceof mongoose_1.Error.ValidationError) {
            if (error.errors.email) {
                message = 'Toks paštas jau yra';
            }
        }
        else if (error instanceof mongoose_1.Error) {
            message = error.message;
        }
        else {
            message = 'Serverio klaida registruojantis';
        }
        res.status(400).json({
            error: message,
        });
    }
};
exports.register = register;
