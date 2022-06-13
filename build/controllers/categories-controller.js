"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getCategories = void 0;
const category_model_1 = __importDefault(require("../models/category-model"));
const getCategories = async (req, res) => {
    const categories = await category_model_1.default.find();
    res.status(200).json(categories);
};
exports.getCategories = getCategories;
const getCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await category_model_1.default.findById(id);
        res.status(200).json(category);
    }
    catch (error) {
        res.status(404).json({
            error: `Kategorija su id '${id}' nerasta`,
        });
    }
};
exports.getCategory = getCategory;
const createCategory = async (req, res) => {
    const categoryProps = req.body;
    try {
        const createdCategory = await category_model_1.default.create(categoryProps);
        res.status(201).json(createdCategory);
    }
    catch (err) {
        res.status(400).json({ error: 'Serverio klaida kuriant kategoriją' });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const categoryProps = req.body;
    try {
        const updatedCategory = await category_model_1.default.findByIdAndUpdate(id, categoryProps, { new: true });
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(400).json({
            error: 'Serverio klaida atnaujinant kategoriją',
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await category_model_1.default.findByIdAndDelete(id);
        if (deletedCategory === null)
            throw new Error(`Produktas su id '${id}' nerastas`);
        res.status(200).json({
            product: deletedCategory,
        });
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Serverio klaida trinant kategoriją',
        });
    }
};
exports.deleteCategory = deleteCategory;
