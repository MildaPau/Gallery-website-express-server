import {
  Schema, model, Types, Document, Model,
} from 'mongoose';
import { CategoryDocument } from './category-model';

type Sculpture = {
  title: string,
  year: number,
  dimensions: string,
  image: string,
  categories: Types.ObjectId[],
  createdAt: string,
  updatedAt: string,
};

export type SculptureProps = Omit<Sculpture, 'createdAt' | 'updatedAt' | 'categories'> & {
  categories?: string[]
};

export type SculptureDocument = Document<
  Types.ObjectId,
  unknown,
  Sculpture
> & Sculpture & {
  _id: Types.ObjectId;
};

export type SculpturePopulatedDocument = Omit<SculptureDocument, 'categories'> & {
  categories: CategoryDocument[]
};

const sculptureSchema = new Schema<Sculpture, Model<Sculpture>>({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  dimensions: {
    type: String,
    required: true,
  },
  image: String,
  // One to many -> Skulptūra gali tureti daug kategorijų.
  categories: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    default: [],
  },
}, {
  timestamps: true,
});

const SculptureModel = model('sculpture', sculptureSchema);

export default SculptureModel;
