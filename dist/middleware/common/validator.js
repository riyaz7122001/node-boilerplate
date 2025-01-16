"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivationValidationRules = exports.IdIntValidationRules = exports.IdValidationRules = exports.ValidateReqParams = void 0;
const api_1 = require("../../utility/api");
const express_validator_1 = require("express-validator");
const ValidateReqParams = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().forEach(err => {
        if (err.type === 'field') {
            extractedErrors.push({ [err.path]: err.msg });
        }
    });
    const transaction = req.transaction;
    if (transaction) {
        await transaction.rollback();
    }
    (0, api_1.sendResponse)(res, 422, 'Invalid or missing parameters', [], extractedErrors);
};
exports.ValidateReqParams = ValidateReqParams;
const IdValidationRules = () => {
    return [
        (0, express_validator_1.param)('id')
            .isUUID().withMessage('Id must be of type UUID').bail(),
    ];
};
exports.IdValidationRules = IdValidationRules;
const IdIntValidationRules = () => {
    return [
        (0, express_validator_1.param)('id')
            .isInt({ min: 1 }).withMessage('Id must be of type Integer').bail(),
    ];
};
exports.IdIntValidationRules = IdIntValidationRules;
const ActivationValidationRules = () => {
    return [
        (0, express_validator_1.param)('id')
            .isUUID().withMessage('Id must be of type UUID').bail(),
        (0, express_validator_1.body)('active')
            .not().isEmpty().withMessage('Active is required').bail()
            .isBoolean({ strict: true }).withMessage('Active must be of type Boolean').bail(),
    ];
};
exports.ActivationValidationRules = ActivationValidationRules;
