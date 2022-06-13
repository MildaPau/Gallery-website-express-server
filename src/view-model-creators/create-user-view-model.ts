import { User, UserDocument } from '../models/user-model';

export type UserViewModel = Omit<User, 'password'> & {
    id: string,
};

const createUserViewModel = (userDoc: UserDocument): UserViewModel => ({
    id: userDoc._id.toString(),
    email: userDoc.email,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
});

export default createUserViewModel;
