import { CardDocument } from '../models/card-model';

export type CardViewModel = {
    id: string,
    title: string,
    city: string,
    year: number,
    location: string,
    link: string,
    image: string,
    updatedAt: string,
};

const createCardViewModel = (cardDoc: CardDocument): CardViewModel => ({
    id: cardDoc._id.toString(),
    title: cardDoc.title,
    city: cardDoc.city,
    year: cardDoc.year,
    location: cardDoc.location,
    link: cardDoc.link,
    image: cardDoc.image,
    updatedAt: cardDoc.updatedAt,
});

export default createCardViewModel;
