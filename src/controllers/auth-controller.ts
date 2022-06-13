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
