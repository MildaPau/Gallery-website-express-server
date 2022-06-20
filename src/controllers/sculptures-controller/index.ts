import { RequestHandler } from 'express';
import { Error } from 'mongoose';
// import { formatSculptureValidationError } from './sculptures-error-formatters';

import SculptureModel, { SculpturePopulatedDocument, SculptureDocument, SculptureProps } from '../../models/sculpture-model';

import createSculptureViewModel, { SculptureViewModel } from '../../view-model-creators/create-sculpture-view-model';

import createSculpturePopulatedViewModel, { SculpturePopulatedViewModel } from '../../view-model-creators/create-sculpture-populated-view-model';
import CategoryModel, { CategoryDocument } from '../../models/category-model';

type SingularSculptureResponse = { sculpture: SculptureViewModel } | ErrorResponseBody;

const validateCategoriesIds = async (categoriesIds?: string[]) => {
  if (categoriesIds !== undefined && categoriesIds.length > 0) {
    const uniqCategoryIds = [...new Set(categoriesIds)];
    const foundCategories = await CategoryModel.find({
      // Ar yra tokių kategorių, kurių id yra viena iš <uniqCategoryIds> masyve esančių reikšmių?
      _id: { $in: uniqCategoryIds },
    });

    if (uniqCategoryIds.length !== foundCategories.length) {
      throw new Error('Dalis kategorijų neegzistuoja');
    }

    return uniqCategoryIds;
  }
  return [];
};

export const getSculptures: RequestHandler<
  unknown,
  { sculptures: SculptureViewModel[] | SculpturePopulatedViewModel[] },
  unknown,
  { populate?: string }
> = async (req, res) => {
  const { populate } = req.query;

  const shouldPopulateCategories = populate === 'categories';

  let sculptures: SculptureViewModel[] | SculpturePopulatedViewModel[];
  if (shouldPopulateCategories) {
    const sculpturePopulatedDocs = await SculptureModel
      .find()
      .populate<{ categories: CategoryDocument[] }>('categories');
    sculptures = sculpturePopulatedDocs.map(createSculpturePopulatedViewModel);
  } else {
    const sculptureDocs = await SculptureModel.find();
    sculptures = sculptureDocs.map(createSculptureViewModel);
  }

  res.status(200).json({ sculptures });
};

export const getSculpture: RequestHandler<
  { id: string },
  { sculpture: SculptureViewModel | SculpturePopulatedViewModel } | ErrorResponseBody,
  unknown,
  { populate?: string }
> = async (req, res) => {
  const { id } = req.params;
  const { populate } = req.query;
  const shouldPopulateCategories = populate === 'categories';

  try {
    const sculptureDoc = shouldPopulateCategories
      ? await SculptureModel.findById(id).populate<{ categories: CategoryDocument[] }>('categories')
      : await SculptureModel.findById(id);

    if (sculptureDoc === null) {
      throw new Error(`Sculptura su id '${id}' nerasta`);
    }
    const sculpture = shouldPopulateCategories
      ? createSculpturePopulatedViewModel(sculptureDoc as SculpturePopulatedDocument)
      : createSculptureViewModel(sculptureDoc as SculptureDocument);

    res.status(200).json({ sculpture });
  } catch (error) {
    res.status(404).json({
      error: `Skulptūra su id '${id}' nerasta`,
    });
  }
};

export const createSculpture: RequestHandler<
  unknown,
  SingularSculptureResponse,
  Partial<SculptureProps>
> = async (req, res) => {
  const sculptureProps: Partial<SculptureProps> = {
    ...req.body,
    image: req.file && `uploads/${req.file.filename}`,
  };
  console.log(sculptureProps);
  // console.log('------------');
  // console.log('Body');
  // console.log(req.body);
  // console.log('------------');
  // console.log('File');
  // console.log(req.file);
  try {
    const uniqCategoriesIds = await validateCategoriesIds(sculptureProps.categories);
    sculptureProps.categories = uniqCategoriesIds;
    const sculptureDoc = await SculptureModel.create(sculptureProps);
    // sculptureDoc.overwrite(sculptureProps);
    if (sculptureProps.title) sculptureDoc.title = sculptureProps.title;
    if (sculptureProps.year) sculptureDoc.year = sculptureProps.year;
    if (sculptureProps.dimensions) sculptureDoc.dimensions = sculptureProps.dimensions;
    if (sculptureProps.image) sculptureDoc.image = sculptureProps.image;
    await sculptureDoc.save();

    console.log('SCulptureDoc');
    console.log(sculptureDoc);

    const sculptureViewModel = createSculptureViewModel(sculptureDoc);

    res.status(201).json({ sculpture: sculptureViewModel });
  } catch (error) {
    // const error = err instanceof Error.ValidationError
    //   ? formatSculptureValidationError(err)
    //   : 'Serverio klaida';
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Klaidingi duomenys',
    });
  }
};

export const updateSculpture: RequestHandler<
  { id: string },
  SingularSculptureResponse,
  Partial<SculptureProps>
> = async (req, res) => {
  const { id } = req.params;
  const sculptureProps = req.body;

  try {
    const uniqCategoriesIds = await validateCategoriesIds(sculptureProps.categories);
    sculptureProps.categories = uniqCategoriesIds;
    const sculptureDoc = await SculptureModel.findByIdAndUpdate(id, sculptureProps, { new: true });
    if (sculptureDoc === null) {
      throw new Error(`Skulptūra su id '${id}' nerasta`);
    }
    const sculptureViewModel = createSculptureViewModel(sculptureDoc);
    res.status(200).json({ sculpture: sculptureViewModel });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Blogi skultūros duomenys',
    });
  }
};

export const deleteSculpture: RequestHandler<
  { id: string },
  SingularSculptureResponse
> = async (req, res) => {
  const { id } = req.params;

  try {
    const sculptureDoc = await SculptureModel.findByIdAndDelete(id);
    if (sculptureDoc === null) {
      throw new Error(`Sculptura su id '${id}' nerasta`);
    }
    const sculptureViewModel = createSculptureViewModel(sculptureDoc);
    res.status(200).json({ sculpture: sculptureViewModel });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Klaida trinant skulptūrą',
    });
  }
};
