"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_1 = require("../utility/api");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const errStatus = (typeof err?.code === 'number' ? err.code : 500);
    const errMsg = err?.message || 'Something went wrong';
    (0, api_1.sendResponse)(res, errStatus, errMsg);
};
exports.errorHandler = errorHandler;
