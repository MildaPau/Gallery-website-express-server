import config from '../config';
import { SculpturePopulatedDocument } from '../models/sculpture-model';
import { SculptureViewModel } from './create-sculpture-view-model';

export type SculpturePopulatedViewModel = Omit<SculptureViewModel, 'categoryIds'> & {
    categories: string[],
};

const createSculpturePopulatedViewModel = (
    sculpturePopulatedDoc: SculpturePopulatedDocument,
): SculpturePopulatedViewModel => ({
    id: sculpturePopulatedDoc._id.toString(),
    title: sculpturePopulatedDoc.title,
    year: sculpturePopulatedDoc.year,
    dimensions: sculpturePopulatedDoc.dimensions,
    image: sculpturePopulatedDoc.image && `${config.server.domain}/${sculpturePopulatedDoc.image}`.replaceAll('\\', '/'),
    updatedAt: sculpturePopulatedDoc.updatedAt,
    categories: sculpturePopulatedDoc.categories.map((categoryDoc) => categoryDoc.title),
});

export default createSculpturePopulatedViewModel;
