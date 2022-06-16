import { Error } from 'mongoose';

type ErrorMessagesLT = {
  title: string,
  city: string,
  year: string,
  location: string,
  image: string,
};

const cardValidationErrorMessagesLT: ErrorMessagesLT = {
  title: 'Trūksta kortelės pavadinimo',
  city: 'Trūksta kortelės miesto',
  year: 'Trūksta kortelės metų',
  location: 'Trūksta kortelės vietos',
  image: 'Trūksta kortelės nuotraukos',
};

const isErrorMessageLT = (property: string)
  : property is keyof ErrorMessagesLT => property in cardValidationErrorMessagesLT;

export const formatCardValidationError = (validationError: Error.ValidationError) => {
  const errorArray = Object.entries(validationError.errors);
  for (let i = 0; i < errorArray.length; i += 1) {
    const [property] = errorArray[i];
    if (isErrorMessageLT(property)) {
      return cardValidationErrorMessagesLT[property];
    }
  }

  return 'Trūksta duomenų';
};
