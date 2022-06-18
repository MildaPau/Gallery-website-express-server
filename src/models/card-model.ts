import {
  Schema, model, Types, Document, Model,
} from 'mongoose';

type Card = {
  title: string,
  city: string,
  year: number,
  location: string,
  image: string,
  link: string,
  createdAt: string,
  updatedAt: string,
};

export type CardProps = Omit<Card, 'createdAt' | 'updatedAt'>;

export type CardDocument = Document<
  Types.ObjectId,
  unknown,
  Card
> & Card & {
  _id: Types.ObjectId;
};

const cardSchema = new Schema<Card, Model<Card>>({
  title: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  link: String,
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const CardModel = model('card', cardSchema);

export default CardModel;
