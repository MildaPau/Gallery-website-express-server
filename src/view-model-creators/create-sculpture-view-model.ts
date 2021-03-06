import config from '../config';
import { SculptureDocument } from '../models/sculpture-model';

export type SculptureViewModel = {
    id: string,
    title: string,
    year: number,
    dimensions: string,
    image: string,
    updatedAt: string,
    categoryIds: string[],
};

const createSculptureViewModel = (sculptureDoc: SculptureDocument): SculptureViewModel => ({
    id: sculptureDoc._id.toString(),
    title: sculptureDoc.title,
    year: sculptureDoc.year,
    dimensions: sculptureDoc.dimensions,
    image: sculptureDoc.image && `${config.server.domain}/${sculptureDoc.image}`.replaceAll('\\', '/'),
    updatedAt: sculptureDoc.updatedAt,
    categoryIds: sculptureDoc.categories.map((categoryId) => categoryId.toString()),

});

export default createSculptureViewModel;
