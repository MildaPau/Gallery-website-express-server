"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const mongoose_1 = require("mongoose");
const product_model_1 = __importDefault(require("../../models/product-model"));
const category_model_1 = __importDefault(require("../../models/category-model"));
const products_error_formatters_1 = require("./products-error-formatters");
const validateCategoriesIds = async (categoriesIds) => {
    if (categoriesIds !== undefined && categoriesIds.length > 0) {
        const uniqCategoryIds = [...new Set(categoriesIds)];
        const foundCategories = await category_model_1.default.find({
            // Ar yra tokių kategorių, kurių id yra viena iš <uniqCategoryIds> masyve esančių reikšmių?
            _id: { $in: uniqCategoryIds },
        });
        if (uniqCategoryIds.length !== foundCategories.length) {
            throw new mongoose_1.Error('Dalis kategorijų neegzistuoja');
        }
        return uniqCategoryIds;
    }
    return [];
};
const getProductsModelData = async (populate, query) => (populate === 'categories'
    ? query.populate('categories')
    : query);
const getProducts = async (req, res) => {
    const { populate } = req.query;
    const products = await getProductsModelData(populate, product_model_1.default.find());
    res.status(200).json(products);
};
exports.getProducts = getProducts;
const getProduct = async (req, res) => {
    const { id } = req.params;
    const { populate } = req.query;
    try {
        const product = await getProductsModelData(populate, product_model_1.default.findById(id));
        res.status(200).json(product);
    }
    catch (error) {
        res.status(404).json({
            error: `Produktas su id '${id}' nerastas`,
        });
    }
};
exports.getProduct = getProduct;
const createProduct = async (req, res) => {
    const productProps = req.body;
    try {
        const uniqCategoriesIds = await validateCategoriesIds(productProps.categories);
        productProps.categories = uniqCategoriesIds;
        const createdProduct = await product_model_1.default.create(productProps);
        res.status(201).json(createdProduct);
    }
    catch (err) {
        const error = err instanceof mongoose_1.Error.ValidationError
            ? (0, products_error_formatters_1.formatProductValidationError)(err)
            : 'Serverio klada';
        res.status(400).json({ error });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const productProps = req.body;
    try {
        const uniqCategoriesIds = await validateCategoriesIds(productProps.categories);
        productProps.categories = uniqCategoriesIds;
        const updatedProduct = await product_model_1.default.findByIdAndUpdate(id, productProps, { new: true });
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(404).json({
            error: error instanceof mongoose_1.Error ? error.message : 'Blogi produkto duomenys',
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await product_model_1.default.findByIdAndDelete(id);
        if (deletedProduct === null)
            throw new mongoose_1.Error(`Produktas su id '${id}' nerastas`);
        res.status(200).json({
            product: deletedProduct,
        });
    }
    catch (error) {
        res.status(404).json({
            error: error instanceof mongoose_1.Error ? error.message : error,
        });
    }
};
exports.deleteProduct = deleteProduct;
