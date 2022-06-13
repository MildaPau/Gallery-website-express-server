"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatProductValidationError = void 0;
const productValidationErrorMessagesLT = {
    price: 'Trūksta produkto kainos',
    amount: 'Trūksta produkto kiekio',
    title: 'Trūksta produkto pavadinimo',
};
const isErrorMessageLT = (property) => property in productValidationErrorMessagesLT;
const formatProductValidationError = (validationError) => {
    const errorArray = Object.entries(validationError.errors);
    for (let i = 0; i < errorArray.length; i += 1) {
        const [property] = errorArray[i];
        if (isErrorMessageLT(property)) {
            return productValidationErrorMessagesLT[property];
        }
    }
    return 'Trūksta duomenų';
};
exports.formatProductValidationError = formatProductValidationError;
