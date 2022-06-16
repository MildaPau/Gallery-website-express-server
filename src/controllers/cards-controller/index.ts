import { RequestHandler } from 'express';
import { Error } from 'mongoose';
import CardModel, { CardProps } from '../../models/card-model';
import createCardViewModel, { CardViewModel } from '../../view-model-creators/create-card-view-model';
import { formatCardValidationError } from './cards-error-formatters';

type SingularCardResponse = { card: CardViewModel } | ErrorResponseBody;

export const getCards: RequestHandler<
  unknown,
  { cards: CardViewModel[] },
  unknown
> = async (req, res) => {
  const cardDocs = await CardModel.find();

  res.status(200).json({
    cards: cardDocs
      .map((cardDoc) => createCardViewModel(cardDoc)),
  });
};

export const getCard: RequestHandler<{ id: string },
  SingularCardResponse> = async (req, res) => {
    const { id } = req.params;
    try {
      const cardDoc = await CardModel.findById(id);
      if (cardDoc === null) {
        throw new Error(`Kortelė su id '${id}' nerasta`);
      }

      res.status(200).json({
        card: createCardViewModel(cardDoc),
      });
    } catch (error) {
      res.status(404).json({
        error: error instanceof Error ? error.message : 'Klaida ieškant kortelės',
      });
    }
  };

export const createCard: RequestHandler<
  unknown,
  SingularCardResponse,
  CardProps
> = async (req, res) => {
  const cardProps = req.body;
  console.log(cardProps);
  try {
    const cardDoc = await CardModel.create(cardProps);
    const cardViewModel = createCardViewModel(cardDoc);
    res.status(201).json({ card: cardViewModel });
  } catch (err) {
    const error = err instanceof Error.ValidationError
      ? formatCardValidationError(err)
      : 'Serverio klaida';
    res.status(400).json({ error });
  }
};

export const updateCard: RequestHandler<
  { id: string },
  SingularCardResponse,
  Partial<CardProps>
> = async (req, res) => {
  const { id } = req.params;
  const cardProps = req.body;

  try {
    const cardDoc = await CardModel.findByIdAndUpdate(id, cardProps, { new: true });
    if (cardDoc === null) {
      throw new Error(`Kortelė su id '${id}' nerasta`);
    }
    const cardViewModel = createCardViewModel(cardDoc);
    res.status(200).json({ card: cardViewModel });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Blogi skultūros duomenys',
    });
  }
};

export const deleteCard: RequestHandler<
  { id: string },
  SingularCardResponse
> = async (req, res) => {
  const { id } = req.params;

  try {
    const cardDoc = await CardModel.findByIdAndDelete(id);
    if (cardDoc === null) {
      throw new Error(`Kortelė su id '${id}' nerasta`);
    }
    const cardViewModel = createCardViewModel(cardDoc);
    res.status(200).json({ card: cardViewModel });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Klaida trinant skulptūrą',
    });
  }
};
