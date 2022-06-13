"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const products_router_1 = __importDefault(require("./routers/products-router"));
const categories_router_1 = __importDefault(require("./routers/categories-router"));
const auth_router_1 = __importDefault(require("./routers/auth-router"));
const cart_router_1 = __importDefault(require("./routers/cart-router"));
const config_1 = __importDefault(require("./config"));
const server = (0, express_1.default)();
// Middlewares
server.use((0, morgan_1.default)(':method :url :status'));
server.use(express_1.default.static('public'));
server.use(express_1.default.json());
server.use('/api/products', products_router_1.default);
server.use('/api/categories', categories_router_1.default);
server.use('/api/auth', auth_router_1.default);
server.use('/api/cart', cart_router_1.default);
mongoose_1.default.connect(config_1.default.db.connectionUrl, {
    retryWrites: true,
    w: 'majority',
}, (error) => {
    if (error) {
        console.log(`Nepavyko Prisijungti:\n${error.message}`);
        return;
    }
    console.log('Successfully connected to MongoDB');
    server.listen(1337, () => console.log('Appliaction server is running on: http://localhost:1337'));
});
/*
// 10:57
  TODO: išspręst problemą su tipų įtraukimu, kad ts-node compiler'is ir ts-server'is matytų
  ir nuadotų tuos pačius tipus
*/
