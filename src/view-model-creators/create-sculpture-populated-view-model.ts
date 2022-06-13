import { SculpturePopulatedDocument } from '../models/sculpture-model';
import createCategoryViewModel, { CategoryViewModel } from './create-category-view-model';
import { SculptureViewModel } from './create-sculpture-view-model';

export type SculpturePopulatedViewModel = Omit<SculptureViewModel, 'categoryIds'> & {
    categories: CategoryViewModel[],
};

const createSculpturePopulatedViewModel = (
    sculpturePopulatedDoc: SculpturePopulatedDocument,
): SculpturePopulatedViewModel => ({
    id: sculpturePopulatedDoc._id.toString(),
    title: sculpturePopulatedDoc.title,
    year: sculpturePopulatedDoc.year,
    dimensions: sculpturePopulatedDoc.dimensions,
    image: sculpturePopulatedDoc.image,
    createdAt: sculpturePopulatedDoc.createdAt,
    updatedAt: sculpturePopulatedDoc.updatedAt,
    categories: sculpturePopulatedDoc.categories.map(createCategoryViewModel),
});

export default createSculpturePopulatedViewModel;
