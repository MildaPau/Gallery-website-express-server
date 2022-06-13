"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.addItem = exports.getCart = void 0;
// import ProductModel from '../models/product-model';
// import UserModel from '../models/user-model';
const getCart = async (req, res) => {
    const { authUser } = req;
    res.status(200).send({
        cart: authUser.cart,
    });
};
exports.getCart = getCart;
const addItem = async (req, res) => {
    const newCartItemData = req.body;
    const { authUser } = req;
    try {
        const productExistsInCart = authUser.cart.some((cartItem) => cartItem.productId.equals(newCartItemData.productId));
        if (productExistsInCart) {
            throw new Error('Toks daiktas jau yra krepšelyje');
        }
        authUser.cart.push(newCartItemData);
        await authUser.save();
        res.status(200).json({
            cartItem: authUser.cart[authUser.cart.length - 1],
        });
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Neteisingi pridedamo produkto duomenys',
        });
    }
};
exports.addItem = addItem;
const updateItem = async (req, res) => {
    res.status(200).send('updateItem');
};
exports.updateItem = updateItem;
const deleteItem = async (req, res) => {
    const { itemId } = req.params;
    const user = req.authUser;
    try {
        const deletedItem = user.cart.find((cartItem) => cartItem._id.equals(itemId));
        if (deletedItem === undefined) {
            res.status(400).json({
                error: 'Nerastas pirkinių krepšelio daiktas',
            });
            return;
        }
        user.cart = user.cart.filter((cartItem) => cartItem !== deletedItem);
        await user.save();
        res.status(200).json({ deletedItem });
    }
    catch (error) {
        res.status(400).json({
            error: 'Neteisingi pridedamo produkto duomenys',
        });
    }
};
exports.deleteItem = deleteItem;
