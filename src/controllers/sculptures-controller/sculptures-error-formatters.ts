import { Error } from 'mongoose';

type ErrorMessagesLT = {
  title: string,
  year: string,
  dimensions: string,
  image: string,
};

const sculptureValidationErrorMessagesLT: ErrorMessagesLT = {
  title: 'Trūksta skulptūros pavadinimo',
  year: 'Trūksta skulptūros metų',
  dimensions: 'Trūksta skulptūros išmatavimų',
  image: 'Trūksta skulptūros nuotraukos',
};

const isErrorMessageLT = (property: string)
  : property is keyof ErrorMessagesLT => property in sculptureValidationErrorMessagesLT;

export const formatSculptureValidationError = (validationError: Error.ValidationError) => {
  const errorArray = Object.entries(validationError.errors);
  for (let i = 0; i < errorArray.length; i += 1) {
    const [property] = errorArray[i];
    if (isErrorMessageLT(property)) {
      return sculptureValidationErrorMessagesLT[property];
    }
  }

  return 'Trūksta duomenų';
};
