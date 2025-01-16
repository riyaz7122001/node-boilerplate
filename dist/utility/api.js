"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = exports.sendResponse = void 0;
const crypto_1 = require("crypto");
const sendResponse = (res, statusCode, message, data = [], errors = []) => {
    const response = {
        success: true,
        data: [],
        message: '',
        errors: []
    };
    if ([200, 201, 202, 203, 204].includes(statusCode)) {
        response.success = true;
    }
    else {
        response.success = false;
    }
    response.data = data;
    response.message = message ?? '';
    response.errors = errors;
    res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
const generateOtp = () => {
    return new Promise((resolve, reject) => {
        (0, crypto_1.randomInt)(100000, 999999, (err, num) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(num.toString());
            }
        });
    });
};
exports.generateOtp = generateOtp;
