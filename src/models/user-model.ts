import {
  Schema,
  Model,
  Types,
  Document,
  model,
} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export type User = {
  email: string,
  password: string,
  createdAt: string,
  updatedAt: string,
};

export type UserProps = Omit<User, 'createdAt' | 'updatedAt'>;

export type UserDocument = (Document<Types.ObjectId, unknown, User> & User & {
  _id: Types.ObjectId;
});

type UserModelType = Model<User>;

const userSchema = new Schema<User, UserModelType>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

userSchema.plugin(uniqueValidator);

const UserModel = model('User', userSchema);

export default UserModel;
