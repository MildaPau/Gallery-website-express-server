import { Error } from 'mongoose';
import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel, { UserProps } from '../models/user-model';
import config from '../config';
import createUserViewModel, { UserViewModel } from '../view-model-creators/create-user-view-model';

type AuthResponseBody = {
  user: UserViewModel,
  token: string,
} | ErrorResponseBody;

export const checkEmail: RequestHandler<
  unknown,
  { valid: true } | ErrorResponseBody,
  unknown,
  { email?: string }
> = async (req, res) => {
  const { email } = req.query;

  try {
    if (email === undefined) {
      throw new Error('Reikalingas paštas patikrinimui');
    }

    const userDoc = await UserModel.findOne({ email });
    if (userDoc !== null) {
      throw new Error('Paštas užimtas');
    }

    res.status(200).json({
      valid: true,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Serverio klaida atpažįstant vartotoją',
    });
  }
};

export const login: RequestHandler<
  unknown,
  AuthResponseBody,
  Partial<UserProps>
> = async (req, res) => {
  const { email, password } = req.body;
  //   if (!email) throw new Error('Privalomas el. paštas');
  //   if (!password) throw new Error('Privalomas slaptažodis');
  //   await UserModel.create({
  //     email,
  //     password: bcrypt.hashSync(password, 5),
  //   });
  //   res.status(200).send('Vartotojas sukurtas');
  // };
  try {
    if (!email) throw new Error('Privalomas el. paštas');
    if (!password) throw new Error('Privalomas slaptažodis');
    const userDoc = await UserModel.findOne({ email });
    if (userDoc === null) throw new Error(`Vartotojas su paštu '${email}' nerastas`);

    const passwordIsCorrect = bcrypt.compareSync(password, userDoc.password);
    if (!passwordIsCorrect) throw new Error('Slaptažodis neteisingas');
    const token = jwt.sign({ email }, config.token.secret);

    res.status(200).json({
      user: createUserViewModel(userDoc),
      token: `Bearer ${token}`,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Serverio klaida prisijungiant',
    });
  }
};

export const authenticate: RequestHandler<
  unknown,
  AuthResponseBody
> = async (req, res) => {
  try {
    if (req.tokenData === undefined) {
      throw new Error('Užšifruotuose duomenyse nėra vartotojo duomenų');
    }
    const { email, token } = req.tokenData;
    const userDoc = await UserModel.findOne({ email });

    if (userDoc === null) {
      throw new Error(`Vartotojas nerastas su tokiu paštu '${email}'`);
    }
    const user = createUserViewModel(userDoc);
    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'serverio klaida atpažįstant vartotoją',
    });
  }
};
