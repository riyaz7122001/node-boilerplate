"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartTransaction = void 0;
const database_1 = __importDefault(require("../../setup/database"));
const api_1 = require("../../utility/api");
const sequelize_1 = require("sequelize");
const StartTransaction = async (req, res, next) => {
    try {
        const transaction = await database_1.default.transaction({ isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ });
        req.transaction = transaction;
        next();
    }
    catch (error) {
        (0, api_1.sendResponse)(res, 500, 'Error while beginning transaction');
    }
};
exports.StartTransaction = StartTransaction;
